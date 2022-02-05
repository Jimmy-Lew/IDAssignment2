console.log("loaded script.js");

const apiURL = 'https://random-words-api.vercel.app/word';
const retrievedDifficulty = window.localStorage.getItem('difficulty');


let pHealth = 100
let eHealth = 100
const baseAttack = 5;
let comboList = []

/**
 * Calls API
 * @returns {dictionary} Dictionary containing words and their respective definitions 
 */
const GetWordsAndDefs = async () => {
    let wordDict = {};

    for (let i = 0; i < 3; i++) 
    {
        let response = await fetch(apiURL)
        let data = await response.json();
        const {
            word,
            definition
        } = data[0]

        wordDict[word] = definition;
    }

    return wordDict;
}

/**
 * Display words retrieved from API
 * @param {dictionary} wordDict 
 */
const DisplayWords = function (wordDict) {
    let index = 0;

    Object.keys(wordDict).forEach(key => {
        index ++;
        $(`.wordSelection-${index} p`).text(key);
    })    

}

/**
 * Display definition of written word
 * @param {string} selectedWord 
 * @param {dictionary} wordDict 
 */
const DisplayDefinition = function (selectedWord, wordDict) {
    const definition = wordDict[selectedWord];
}

/**
 * Calculates complexity rating of words
 * @param {dictionary} wordDict 
 * @returns {dictionary} Dictionary containing words and their respective complexity rating
 */
const CalculateWordComplexity = function (userInput) {
    if (userInput.length >= 10) return 2;
    return 1;
}

/**
 * 
 * @param {string} retrievedDifficulty 
 * @returns Time user has to type word
 */
const DifficultyTimer = function (retrievedDifficulty){
    if (retrievedDifficulty === 'Easy') return 30;
    else if (retrievedDifficulty === 'Medium') return 20;
    else if (retrievedDifficulty === 'Hard') return 15;
    return 5;
}

function CalculateCombo(comboList){
    const lastIndex = comboList.length - 1
    let comboChain = 0;

    for (let index = 1; comboList[lastIndex] === comboList[lastIndex - index] && index <= 3; ++index){
        comboChain ++;
    }

    if (comboList[lastIndex] === 1) return 1 + (0.1*comboChain);
    if (comboList[lastIndex] === 2) return 1 + (0.15*comboChain);
}

function calcWPM(userInput,diffTime, timeLeft){
    let timeTaken = diffTime - timeLeft;
    return (userInput.length/timeTaken)*12
}

function CalculateDamage(userInput, comboList, typeSpeed) {
    // Logic : WPM (Time taken to write word, length taken into account, does a certian amount of damage.)
    // Calculate Damage (every 5s - damage 20% less)
    const comboBonus = CalculateCombo(comboList);
    return baseAttack * (typeSpeed / 40) * comboBonus
}

/**
 * 
 * @returns {string[]} User input text
 */
function GetUserInput(){
    return $("#textInput").val().split(""); // As Array
}

function ClearUserInput(){
    $("#textInput").val("");
}

/**
 * 
 * @param {number} timeLeft 
 */
function Timer(timeLeft){
    console.log(`%c>> Running Timer...`, 'color: red;');
    timeLeft--;
    $("#time").text(`Time: ${timeLeft}s`); // Updates DOM Time Text
    return timeLeft;
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {dictionary} wordDict dictionary of words and their definitions
 * @returns {string | undefined} Predicted word user wishes to input
 */
function AutoPredict(userInput, wordDict){
    console.log('%c>> Running AutoPredict...', 'color: #1aacf0;');
    
    // Read Through Dictionary Words
    let wordList = [];
    Object.keys(wordDict).forEach(key => {
        wordList.push(key.split(""));
    })
    // Check each char at each position to see if they are the same (Prediction)
    if (userInput.length === 0) return;
    for (word of wordList){
        if (CompareWords(userInput, word)) return word.join("");
    }
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {string[]} wordToCompare word to compare userInput against
 * @returns {boolean} Checks if user input matches word
 */
function CompareWords(userInput, wordToCompare) {
    for (let letter in userInput) {
        if (userInput[letter] !== wordToCompare[letter]) return false;
    }
    return true;
}

function CheckCompletion(userInput,predictedWord){
    console.log('%c>> Running Check...', 'color: #1af08c;');
    if(userInput.join("") === predictedWord) return true;
    return false;
}

// #region Main
const GameLogic = async () => {
    // --- Initializing Health (Player & Enemy) & Input field ---
    $("#pHealth").text(`Player_Health: ${pHealth}`);    // Updates DOM Time Text
    $("#eHealth").text(`Enemy_Health: ${eHealth}`);     // Updates DOM Time Text
    ClearUserInput();                                   // Clears the input field
    
    
    let wordDict = await GetWordsAndDefs();
    DisplayWords(wordDict);
    const diffTime = DifficultyTimer(retrievedDifficulty);
    let timeLeft = diffTime;
    

    // --- Runs Timer ---
    let timerID = setInterval(function(){               // Created an anonymous function to run the code below
        const x = Timer(timeLeft);                      // Calls Timer function and returns the time remaining to a temporary variable called 'x'
        timeLeft = x;                                   // Reassigns timeLeft to the value of x
        if(timeLeft === 0) clearInterval(timerID);
    },1000,timeLeft);                                   // when the interval function iterates (every 1000ms/1s), a new value of timeLeft (aka 'x') is passed in and updated.

    
    // Makeshift "Loop" (called every second)
    var check = setInterval(function(){ 
        const userInput = GetUserInput();
        const predictedWord = AutoPredict(userInput,wordDict);
        const finishStatus = CheckCompletion(userInput,predictedWord);
        
        console.log(`User Input: ${userInput.join("")}`);
        console.log(`Predicted Word: ${predictedWord}`);
        console.log(`Finish: ${finishStatus}`);
        
        if (finishStatus === true && timeLeft !== 0){


            console.log('%c>> Moving To Next Stage...','color: #1aacf0;');

            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = calcWPM(userInput,diffTime,timeLeft);
            const damageDealt = CalculateDamage(userInput.join(""), comboList, WPM);
            
            eHealth -= damageDealt;

            console.log(`Damage: ${damageDealt}`);
            console.log(`Word Per Minute (WMP): ${WPM}`);
            // Calculate Player Damage 


            // --- Prepare for next round! ---
            clearInterval(timerID);     // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);       // Stops the Check setInterval from iterating. (breaks)
            
            GameLogic();                // Recalls function to call API and update new words and stuff
        }
        else if(timeLeft === 0) {

            console.log('%c>> You Ran Out Of Time!', 'color: red;');

            // Calculate Enemy Damage to Player  
            pHealth -= 100;
            
            // --- Prepare for next round! ---
            clearInterval(timerID);     // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);       // Stops the Check setInterval from iterating. (breaks)
            console.log(`ComboList: ${comboList}`);
            if(pHealth <= 0) alert('You Lost (L)');
            else GameLogic();                // Recalls function to call API and update new words and stuff
        }
    },100);
    

    
    

    
    
}
// #endregion

GameLogic();
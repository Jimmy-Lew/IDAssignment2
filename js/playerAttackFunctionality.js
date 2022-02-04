console.log("loaded script.js");

const apiURL = 'https://random-words-api.vercel.app/word';
const retrievedDifficulty = window.localStorage.getItem('difficulty');

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
const CalculateWordComplexity = function (wordDict) {
    wordComplexity = {};

    Object.keys(wordDict).forEach(key => {
        let wordLength = key.length;

        if (wordLength >= 10){
            wordComplexity[key] = 2;
        }
        else{
            wordComplexity[key] = 1;
        }
    })

    return wordComplexity;
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

const CalculateDamage = function (wordDict,time) {
    // Logic : WPS (Time taken to write word, length taken into account, does a certian amount of damage.)
    // Timer 
    // Calculate WPS
    // Calculate Damage (every 5s - damage 20% less)
}

/**
 * 
 * @returns {string[]} User input text
 */
function GetUserInput(){
    return $("#textInput").val().split("") // As Array
}

/**
 * 
 * @param {number} diffTime 
 */
function Timer(diffTime){
    console.log('%c>> Starting Timer...', 'color: red;');

    var timeLeft = diffTime; //Max time ; based on difficulty
    var Timer = setInterval(function(){
        timeLeft--;
        $("#time").text(`Time: ${timeLeft}s`);
        if(timeLeft <= 0) clearInterval(Timer);
        return timeLeft;
    },1000);
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {dictionary} wordDict dictionary of words and their definitions
 * @returns {string | undefined} Predicted word user wishes to input
 */
function AutoPredict(userInput, wordDict){
    console.log('%c>> Running AutoPredict...', 'color: #1aacf0;')
    
    // Read Through Dictionary Words
    let wordList = []
    Object.keys(wordDict).forEach(key => {
        wordList.push(key.split(""))
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

// ------------ Main --------------
const GameLogic = async () => {
    let wordDict = await getWordsAndDefs();

    DisplayWords(wordDict);
    let wordComplexity = CalculateWordComplexity(wordDict);
    const diffTime = DifficultyTimer(retrievedDifficulty);
    Timer(diffTime);
    
    // Makeshift "Loop"
    SetInterval(function(){ 
        const userInput = GetUserInput();
        const predictedWord = AutoPredict(userInput,wordDict)
        const finishStatus = CheckCompletion(userInput,predictedWord)
        
        console.log(`User Input: ${userInput.join("")}`);
        console.log(`Predicted Word: ${predictedWord}`);
        console.log(`Finish: ${finishStatus}`);
    },1000);
    // const damage = calculateDamage(wordDict,time);
}

GameLogic();
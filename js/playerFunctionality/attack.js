console.log("loaded script.js");

const retrievedDifficulty = window.localStorage.getItem('difficulty');
const baseAttack = 5;

let pHealth = 100
let eHealth = 100
let comboList = []

/**
 * Calculates complexity rating of words
 * @param {string} userInput
 * @returns {number} complexity of input word
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
const RetrieveDifficultyData = function (retrievedDifficulty){
    if (retrievedDifficulty === 'Easy') return 30;
    else if (retrievedDifficulty === 'Medium') return 20;
    else if (retrievedDifficulty === 'Hard') return 15;
    return 5.5;
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

function CalculateDamage(comboList, typeSpeed) {
    const comboBonus = CalculateCombo(comboList);
    return baseAttack * (typeSpeed / 40) * comboBonus
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {Map} wordMap dictionary of words and their definitions
 * @returns {string | undefined} Predicted word user wishes to input
 */
function AutoPredict(userInput, wordMap){
    console.log('%c>> Running AutoPredict...', 'color: #1aacf0;');
    
    // Read Through Dictionary Words
    let wordList = [];
    wordMap.forEach((value, key) => {
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
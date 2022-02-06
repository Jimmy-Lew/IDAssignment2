console.log("loaded script.js");

const baseAttack = 5;

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
    if (retrievedDifficulty === 'Easy') return 7.5;         // 40WPM
    else if (retrievedDifficulty === 'Medium') return 5;    // 60WPM
    else if (retrievedDifficulty === 'Hard') return 3.5;    // 90WPM
    return 1.5;                                             // 100WPM
}

function cullComboList(comboList) {
    if (comboList.length > 3) return comboList.slice(-4);
    return comboList;
}

function CalculateCombo(comboList){
    comboList = cullComboList(comboList);

    const lastIndex = comboList.length - 1
    let comboChain = 0;

    for (let index = 1; comboList[lastIndex] === comboList[lastIndex - index] && index <= 3; ++index){
        comboChain ++;
    }

    if (comboList[lastIndex] === 1) return 1 + (0.1*comboChain);
    if (comboList[lastIndex] === 2) return 1 + (0.15*comboChain);
}

function CalculateWordsPerMin(userInput, diffTime, timeLeft, timeSubtracted){
    let timeTaken = diffTime - timeLeft - timeSubtracted;
    return Math.ceil(((userInput.length/timeTaken)*60)/5);
}

function CalculateDamage(comboList, typeSpeed) {
    const comboBonus = CalculateCombo(comboList);
    return Math.floor(baseAttack * (typeSpeed / 40) * comboBonus);
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {Map} wordMap dictionary of words and their definitions
 * @returns {string | undefined} Predicted word user wishes to input
 */
function AutoPredict(userInput, wordMap){
    // console.log('%c>> Running AutoPredict...', 'color: #1aacf0;');
    
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

function IsComplete(userInput,predictedWord){
    // console.log('%c>> Running Check...', 'color: #1af08c;');
    if(userInput.join("") === predictedWord) return true;
    return false;
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {string} predictedWord word to compare userInput against
 * @returns {boolean} Checks if user made a typo
 */
function HasTypo(userInput,predictedWord){
    if(userInput.length > 0 && predictedWord === undefined) return true;
    return false;
}
console.log("loaded script.js");

/**
 * Calculates complexity rating of words
 * @param {string} userInput
 * @returns {number} complexity of input word
 */
const CalculateWordComplexity = function (userInput) {
    if (userInput.length >= 10) return 2;
    return 1;
}

function cullComboList(comboList) {
    if (comboList.length > 3) return comboList.slice(-4);
    return comboList;
}

function CalculateCombo(comboList) {
    comboList = cullComboList(comboList);

    const lastIndex = comboList.length - 1
    let comboChain = 0;

    for (let index = 1; comboList[lastIndex] === comboList[lastIndex - index] && index <= 3; ++index) {
        comboChain++;
    }

    return (comboList[lastIndex] === 1) ? 1 + (0.1 * comboChain)
        : 1 + (0.15 * comboChain);
}

function CalculateWordsPerMin(userInput, diffTime, timeLeft) {
    let timeTaken = diffTime - timeLeft - 0.4;
    return Math.ceil(((userInput.length / timeTaken) * 60) / 7);
}

function CalculateDamage(baseAttack, comboList, typeSpeed) {
    const comboBonus = CalculateCombo(comboList);
    return Math.floor(baseAttack * (typeSpeed / 50) * comboBonus);
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {Map} wordMap dictionary of words and their definitions
 * @returns {string | undefined} Predicted word user wishes to input
 */
function AutoPredict(userInput, wordMap) {
    // Read Through Dictionary Words
    let wordList = [];
    wordMap.forEach((value, key) => {
        wordList.push(key.split(""));
    })

    // Check each char at each position to see if they are the same (Prediction)
    if (userInput.length === 0) return;
    for (word of wordList) {
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

function IsComplete(userInput, predictedWord) {
    if (userInput.join("") === predictedWord) return true;
    return false;
}

/**
 * 
 * @param {string[]} userInput user input text
 * @param {string} predictedWord word to compare userInput against
 * @returns {boolean} Checks if user made a typo
 */
function HasTypo(userInput, predictedWord) {
    if (userInput.length > 0 && predictedWord === undefined) return true;
    return false;
}
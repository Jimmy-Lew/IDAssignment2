console.log("loaded script.js");

const apiURL = 'https://random-words-api.vercel.app/word';
const retrievedDifficulty = window.localStorage.getItem('difficulty');

/**
 * Calls API
 * @returns {dictionary} Dictionary containing words and their respective definitions 
 */
const getWordsAndDefs = async () => {
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
const displayWords = function (wordDict) {
    let index = 1;

    Object.keys(wordDict).forEach(key => {
        $(`.wordSelection-${index} p`).text(key);
        index ++;
    })    

}

/**
 * Display definition of written word
 * @param {string} selectedWord 
 * @param {dictionary} wordDict 
 */
const displayDefinition = function (selectedWord, wordDict) {
    const definition = wordDict[selectedWord];
}

/**
 * Calculates complexity rating of words
 * @param {dictionary} wordDict 
 * @returns {dictionary} Dictionary containing words and their respective complexity rating
 */
const calculateWordComplexity = function (wordDict) {
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

const gameLogic = async () => {
    let wordDict = await getWordsAndDefs();

    displayWords(wordDict);
    let wordComplexity = calculateWordComplexity(wordDict);
}

gameLogic();
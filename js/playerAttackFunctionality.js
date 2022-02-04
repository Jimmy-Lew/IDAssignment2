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

const difficultyTimer = function (retrievedDifficulty){
    if (retrievedDifficulty === 'Easy') {
        return 30; // time, base damage dealt by player
    }
    else if (retrievedDifficulty === 'Medium'){
        return 20;
    }
    else if (retrievedDifficulty === 'Hard'){
        return 15;
    }
    else // Syncope Difficulty
    {
        return 5;
    }
}

const calculateDamage = function (wordDict,time) {
    // Logic : WPS (Time taken to write word, length taken into account, does a certian amount of damage.)
    // Timer 
    // Calculate WPS
    // Calculate Damage (every 5s - damage 20% less)
}

function getUserInput(){
    return [$("#textInput").val().split("")] // As Array
}

function timer(diffTime){
    console.log('%c>> Starting Timer...', 'color: red;');
    var timeleft = diffTime; //Max time ; based on difficulty
    var Timer = setInterval(function(){
        timeleft--;
        $("#time").text(`Time: ${timeleft}s`)
        if(timeleft <= 0)
            clearInterval(Timer);
        return timeleft;
    },1000);
}


function autoPredict(userInput,wordDict){
    console.log('%c>> Running AutoPredict...', 'color: #1aacf0;')
    let predictedWord = undefined;
    
    // Read Through Dictionary Words
    let wordList = []
    Object.keys(wordDict).forEach(key => {
        wordList.push(key.split(""))
    })

    // Check each char at each position to see if they are the same (Prediction)
    if (userInput != 0) {
        for (let wl_index = 0; wl_index < wordList.length; wl_index++) {
            for (let u_index = 0; u_index < userInput.length; u_index++) {
                if (userInput[0][u_index] == wordList[wl_index][u_index]) {
                    predictedWord = wordList[wl_index].join("")
                }
            }
        }
        return predictedWord;
    }
}

function checkCompletion(userInput,apWord){
    console.log('%c>> Running Check...', 'color: #1af08c;');
    if(userInput[0].join("") === apWord){
        return true;
    }
    return false;
}

// ------------ Main --------------
const gameLogic = async () => {
    let wordDict = await getWordsAndDefs();

    displayWords(wordDict);
    let wordComplexity = calculateWordComplexity(wordDict);
    const diffTime = difficultyTimer(retrievedDifficulty);
    timer(diffTime);
    
    // Makeshift "Loop"
    setInterval(function(){ 
        const userInput = getUserInput();
        const apWord = autoPredict(userInput,wordDict)
        const finishStatus = checkCompletion(userInput,apWord)

        console.log("User Input: " + userInput.join(""));
        console.log("Predicted Word: "+ apWord);
        console.log("Finish: " + finishStatus);
    },1000);
    // const damage = calculateDamage(wordDict,time);
}

gameLogic();
const apiURL = 'https://random-words-api.vercel.app/word';
const backupURL = 'https://random-word-api.herokuapp.com/word';

async function GetWordsAndDefs(noOfCalls) {
    let wordMap = new Map(); // Similar to a dictionary (key:value) [obj.get(x) >> gives value associated with "x"]

    for (; wordMap.size < noOfCalls;) {
        let response = await fetch(apiURL);
        let data = await response.json();
        const {
            word, definition
        } = data[0];

        if (/^[a-z]+$/i.test(word) && word.length <= 14) { // To Test words and check if they contain only char a-z
            wordMap.set(word, definition);
        }
    }

    return wordMap;
}
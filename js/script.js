console.log("loaded script.js");

const apiURL = 'https://random-words-api.vercel.app/word';

const getWordsAndDefs = async () => {
    let wordArray = [];
    let definitionArray = [];
    for (let i = 0; i < 3; i++) {
        let response = await fetch(apiURL)
        let data = await response.json();
        const {
            word,
            definition
        } = data[0]

        wordArray.push(word);
        definitionArray.push(definition);
    }

    return [wordArray, definitionArray];
}

const displayWords = async () => {
    let data = await getWordsAndDefs();
    let wordArray = data[0];
    let definitionArray = data[1];

    for (const [index, element] of wordArray.entries()) {
        $(`.wordSelection-${index+1} p`).text(element);
    }
}

displayWords();
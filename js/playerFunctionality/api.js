const apiURL = 'https://random-words-api.vercel.app/word';

const GetWordsAndDefs = async () => {
    let wordMap = new Map();

    for (; wordMap.size < 3;) 
    {
        let response = await fetch(apiURL)
        let data = await response.json();
        const {
            word,
            definition
        } = data[0]

        if (/^[a-z]+$/i.test(word)){
            wordMap.set(word, definition)
        }   
    }

    return wordMap;
}
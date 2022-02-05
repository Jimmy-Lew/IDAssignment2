const apiURL = 'https://random-words-api.vercel.app/word';

const GetWordsAndDefs = async () => {
    let wordMap = new Map();

    for (let i = 0; i < 3;) 
    {
        let response = await fetch(apiURL)
        let data = await response.json();
        const {
            word,
            definition
        } = data[0]

        if (/^[a-z]+$/i.test(word)){
            wordMap.set(word, definition)
            i++;
        }   
    }

    return wordMap;
}
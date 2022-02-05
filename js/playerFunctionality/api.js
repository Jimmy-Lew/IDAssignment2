const apiURL = 'https://random-words-api.vercel.app/word';

const GetWordsAndDefs = async () => {
    let wordMap = new Map(); // Similar to a dictionary (key:value) [obj.get(x) >> gives value associated with "x"]

    for (let i = 0; i < 3;) 
    {
        let response = await fetch(apiURL)
        let data = await response.json();
        const {
            word,
            definition
        } = data[0]

        if (/^[a-z]+$/i.test(word)){  // To Test words and check if they contain only char a-z
            wordMap.set(word, definition)
            i++;
        }   
    }

    return wordMap;
}
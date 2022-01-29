console.log("loaded script.js");
// --- website JS functions ----



// ---- Game part ---
let wordArray = [];
loadAPI() // Calls and loads in API > Calls main function 




// Retrieve words from API (https://random-words-api.vercel.app/) ()
function loadAPI(){
    console.log("Loading API...");
    for (let i = 0; i < 3; i++) {       
        fetch('https://random-words-api.vercel.app/word')
        .then(res => res.json())
        .then (function (data) {
            let tempArray = [];
            tempArray.push(data[0].word);
            tempArray.push(data[0].definition);
            wordArray.push(tempArray);
            if (wordArray.length === 3){
                main(wordArray)
            }
        })
    }
}

function main(wordArray){
    console.log("test")
    console.log(wordArray.length)
    console.log(wordArray)

    $(".wordSelection-1 p").text(wordArray[0][0])
    $(".wordSelection-2 p").text(wordArray[1][0])
    $(".wordSelection-3 p").text(wordArray[2][0])


    // Flat damage (complexity : word length)
    console.log(wordArray[0][0].length)



    // Combo chaining ()




}







// #region Display
function DisplayWords(wordMap) {
    let index = 0;

    wordMap.forEach((value, key) => {
        index++;
        $(`.wordSelection-${index}`).text(key);
    });
}

function DisplayPlayerHealth(pHealth) {
    $("#pHealth").text(`Player_Health: ${pHealth}`); 
}

function DisplayBossHealth(eHealth) {
    $("#eHealth").text(`Enemy_Health: ${eHealth}`); 
}

function DisplayWPM(WPM) {
    $("#pWPM").text(`Player_WPM: ${WPM}`);
}

/**
 * 
 * @param {number} timeLeft 
 */
function UpdateTimer(timeLeft){
    console.log(`%c>> Running Timer...`, 'color: red;');
    timeLeft--;
    $("#time").text(`Time: ${timeLeft}s`);
    return timeLeft;
}
// #endregion

// #region User Input
function GetUserInput(){
    return $("#textInput").val().split(""); // As Array
}

function ClearUserInput(){
    $("#textInput").val("");
}
// #endregion

function hoverUserInputText(match, wordMap){
    let index = 0;
    let notMatch = 0;
    for (word of wordMap) {
        index++;
        if (word[0] === match) break;
        notMatch++;
    }

    resetDisplayWords(wordMap);
    if (notMatch > 2) return;
    
    $(`.wordSelection-${index}`).css({"transform" : "translateY(-.2em)",
                                      "font-size" : "2.6em"});
}

function resetDisplayWords(wordMap){
    let index = 0;

    wordMap.forEach((value, key) => {
        index++;
        $(`.wordSelection-${index}`).css({"transform" : "",
                                          "font-size" : "2em"})
    });
}
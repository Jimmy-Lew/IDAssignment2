// #region Display
function DisplayWords(wordMap) {
    let index = 0;

    wordMap.forEach((value, key) => {
        index++;
        $(`.wordSelection-${index} p`).text(key);
    });
}

function DisplayPlayerHealth(pHealth) {
    $("#pHealth").text(`Player_Health: ${pHealth}`); 
}

function DisplayBossHealth(eHealth) {
    $("#eHealth").text(`Enemy_Health: ${eHealth}`); 
}

function DisplayWPM(WPM) {
    $("#pWPM").text(`PLayer_WPM: ${WPM}`);
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
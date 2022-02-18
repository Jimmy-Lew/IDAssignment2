// #region Display
function DisplayWords(wordMap) {
    let index = 0;

    wordMap.forEach((value, key) => {
        let charIndex = 0;
        index++;
        $(`.wordSelection-${index}`).remove()
        $("#wordContainer ul").append(`<li class="wordSelection-${index}"></li>`);
        key.split("").forEach(character => {
            charIndex++
            $(`.wordSelection-${index}`).append(`<span class="char-${charIndex}">${character}</span>`);
        })
    });

    ClearUserInput();
}

/**
 * 
 * @param {number} timeLeft 
 */
function UpdateTimer(timeLeft) {
    return timeLeft -= 1;
}
// #endregion

// #region User Input
function GetUserInput() {
    return $("#textInput").val().split(""); // As Array
}

function ClearUserInput() {
    $("#textInput").val("");
}
// #endregion

function renderUserInputText(match, wordMap, userInput) {
    let index = 0;
    let notMatch = 0;
    for (word of wordMap) {
        index++;
        if (word[0] === match) break;
        notMatch++;
    }

    resetDisplayWords(wordMap);
    if (notMatch > 2) return;

    $(`.wordSelection-${index}`).css({
        "transform": "translateY(-.4em)",
        "font-size": "clamp(18px, calc(18px + (41.6 - 18) * ((100vw - 320px) / (1800 - 320))), 41.6px)"
    });

    for (let charIndex = 1; charIndex <= userInput.length; charIndex++) {
        if (userInput[charIndex - 1] === $(`.wordSelection-${index} .char-${charIndex}`).text())
            $(`.wordSelection-${index} .char-${charIndex}`).css({
                "color": "#fff",
                "text-shadow": "0 0 1px #fff, 0px 0px 1px #fff"
            })
    }
}

function resetDisplayWords() {
    for (let i = 1; i < 4; i++) {
        $(`.wordSelection-${i}`).css({
            "transform": "",
            "font-size": "clamp(16px, calc(16px + (36 - 16) * ((100vw - 320px) / (1800 - 320))), 36px)"
        })
        $(`.wordSelection-${i} span`).each(function () {
            $(this).css("color", "#888");
        })
    }
}

function DisplayBossTitle(title) {
    const titleElem = $(".bossTitle");
    titleElem.text(title).css("top", "0em");
    setTimeout(() => { titleElem.css("top", "-2.3em") }, 2000);
}
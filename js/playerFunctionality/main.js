let pHealth = 100
let eHealth = 30
let comboList = []

const retrievedDifficulty = window.localStorage.getItem('difficulty');

// #region Main
async function GameLogic() {
    let userInput;
    let predictedWord;
    let timeSubtracted = 0;
    let finishStatus = false;

    // --- Initializing Health (Player & Enemy) & Input field ---
    DisplayPlayerHealth(pHealth);
    DisplayBossHealth(eHealth);
    ClearUserInput();                            // Clears the input field

    let wordMap = await GetWordsAndDefs();
    resetDisplayWords(wordMap);
    DisplayWords(wordMap);

    const diffTime = RetrieveDifficultyData(retrievedDifficulty);
    let timeLeft = diffTime;

    // --- Runs Timer ---
    let timerID = setInterval(() => {
        const x = UpdateTimer(timeLeft);         // Calls Timer function and returns the time remaining to a temporary variable called 'x'
        timeLeft = Math.ceil(x);                 // Reassigns timeLeft to the value of x (Math.ceil = Rounds up to next largest int)
        if (timeLeft <= 0)
            clearInterval(timerID);
    }, 1000, timeLeft);                          // when the interval function iterates (every 1000ms/1s), a new value of timeLeft (aka 'x') is passed in and updated.


    // Detect change in input
    $("#textInput").on("keyup", () => {
        userInput = GetUserInput();
        predictedWord = AutoPredict(userInput, wordMap);
        finishStatus = IsComplete(userInput, predictedWord);

        // console.log(`User Input: ${userInput.join("")}`);
        // console.log(`Predicted Word: ${predictedWord}`);
        // console.log(`Finish: ${finishStatus}`);
        
        // #region Typo Check
        if (HasTypo(userInput, predictedWord)) {
            timeSubtracted += 1;
            timeLeft -= 1;
        }
        // #endregion
        hoverUserInputText(predictedWord, wordMap);
    });

    // Makeshift "Loop" (called every 100ms)
    var check = setInterval(() => {
        if (finishStatus === true && timeLeft !== 0) {
            console.log('%c>> Moving To Next Stage...', 'color: #1aacf0;');

            // #region Damage Calculation
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = CalculateWordsPerMin(userInput, diffTime, timeLeft, timeSubtracted);
            const damageDealt = CalculateDamage(comboList, WPM);
            // #endregion
            DisplayWPM(WPM);

            eHealth -= damageDealt;

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (eHealth <= 0)
                alert('You win');
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
        else if (timeLeft <= 0) {

            console.log('%c>> You Ran Out Of Time!', 'color: red;');

            // Calculate Enemy Damage to Player  
            pHealth -= 50;

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (pHealth <= 0)
                alert('You Lost (L)');
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
    }, 100);
}
// #endregion

GameLogic();
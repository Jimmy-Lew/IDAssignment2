let totalTimeElapsed = 0;
let comboList = []

let defaultPlayer = new Player(10000, 5);
let boss = new Boss(30, 25, 0, 3);

const retrievedDifficulty = window.localStorage.getItem('difficulty');

function LevelComplete(win){
    if(win) return alert("You win");
    return alert("You lose");
}

// #region Main
async function GameLogic() {
    let userInput;
    let predictedWord;
    let timeSubtracted = 0;
    let isFinished = false;

    // --- Initializing Health (Player & Enemy) & Input field ---
    DisplayPlayerHealth(defaultPlayer.Health);
    DisplayBossHealth(boss.Health);

    resetDisplayWords();
    let wordMap = await GetWordsAndDefs(boss.APICalls);
    DisplayWords(wordMap);
    ClearUserInput();                            // Clears the input field

    const diffTime = RetrieveDifficultyData(retrievedDifficulty);
    let timeLeft = diffTime;

    // --- Runs Timer ---
    let timerID = setInterval(() => {
        const x = UpdateTimer(timeLeft);         // Calls Timer function and returns the time remaining to a temporary variable called 'x'
        totalTimeElapsed ++;
        timeLeft = Math.ceil(x);                 // Reassigns timeLeft to the value of x (Math.ceil = Rounds up to next largest int)
        if (timeLeft <= 0) clearInterval(timerID);
    }, 1000, timeLeft);                          // when the interval function iterates (every 1000ms/1s), a new value of timeLeft (aka 'x') is passed in and updated.

    // Detect change in input
    $("#textInput").on("keyup", () => {
        userInput = GetUserInput();
        predictedWord = AutoPredict(userInput, wordMap);
        isFinished = IsComplete(userInput, predictedWord);

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
        if (isFinished && timeLeft !== 0) {
            console.log('%c>> Moving To Next Stage...', 'color: #1aacf0;');

            // #region Damage Calculation
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = CalculateWordsPerMin(userInput, diffTime, timeLeft, timeSubtracted);
            const damageDealt = CalculateDamage(defaultPlayer.Damage, comboList, WPM);
            // #endregion
            DisplayWPM(WPM);

            boss.damage(damageDealt);

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (boss.Health <= 0) return LevelComplete(true);
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }

        else if (timeLeft <= 0) {
            // Calculate Enemy Damage to Player  
            defaultPlayer.damage(boss.FailureDamage);

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (defaultPlayer.Health <= 0) return LevelComplete(false);
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
    }, 100);
}
// #endregion

GameLogic();
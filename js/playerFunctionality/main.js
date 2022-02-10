let totalTimeElapsed = 0;
let comboList = []
let isFirstRun = true;

let wordTime = 0;
let entityList = [];
let enemy = new Enemy();
let player = new Player();

const retrievedDifficulty = window.localStorage.getItem('difficulty');

const delay = timeInMilli => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), timeInMilli)
  });

async function LevelComplete(win){
    if(win){
        alert("You Won!");
        UpdateLeaderboard();
        await delay(5000);
        window.location.replace(`/`);   
    }
    else{
        alert("You Lost... Try again next time Soldier 07");
        window.location.replace(`/`); // Returns to main menu.
    } 
}

async function parseLocalStorageData(){
    const {retrievedDifficulty, retrievedLevelData, retrievedPlayerData} = retrieveLocalStorage();

    const {DifficultyTimings, Entities} = await getLevelJSON(retrievedLevelData);
    entityList = await getBossJSON(Entities);

    wordTime = DefineWordTime(retrievedDifficulty, DifficultyTimings);
    player = parsePlayerData(retrievedPlayerData);
    enemy = entityList[0];
}

// #region Main
async function GameLogic() {
    let userInput;
    let predictedWord;
    let timeSubtracted = 0;
    let isFinished = false;

    if(isFirstRun) {
        await parseLocalStorageData();
        isFirstRun = false;
    }

    // --- Initializing Health (Player & Enemy) & Input field ---
    DisplayPlayerHealth(player.Health);
    DisplayBossHealth(enemy.Health);

    resetDisplayWords();
    let wordMap = await GetWordsAndDefs(enemy.APICalls);
    DisplayWords(wordMap);

    let timeLeft = wordTime;

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
        renderUserInputText(predictedWord, wordMap, userInput);
    });

    // Makeshift "Loop" (called every 100ms)
    var check = setInterval(() => {
        if (isFinished && timeLeft !== 0) {
            console.log('%c>> Moving To Next Stage...', 'color: #1aacf0;');

            // #region Damage Calculation
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = CalculateWordsPerMin(userInput, wordTime, (timeLeft - timeSubtracted));
            const damageDealt = CalculateDamage(player.Damage, comboList, WPM);
            // #endregion
            DisplayWPM(WPM);

            enemy.damage(damageDealt);

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (enemy.Health <= 0) return LevelComplete(true);
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }

        else if (timeLeft <= 0) {
            // Calculate Enemy Damage to Player  
            player.damage(enemy.FailureDamage);

            // --- Prepare for next round! ---
            clearInterval(timerID);              // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (player.Health <= 0) return LevelComplete(false);
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
    }, 100);
}
// #endregion

console.log(localStorageSpace());
GameLogic();
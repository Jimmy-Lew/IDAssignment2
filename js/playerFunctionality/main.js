let totalTimeElapsed = 0;
let comboList = []
let isFirstRun = true;

let wordTime = 0;
let entityList = [];
let enemy = new Enemy();
let player = new Player();

//-- Audio --
const pDeath = new Audio('Assets/audio/PlayerDeath.wav')
const eGrowl = new Audio('Assets/audio/EnemyGrowl.wav')
const eDeath = new Audio('Assets/audio/EnemyDeath.wav')
const pAttack = new Audio('Assets/audio/PlayerAttack.wav')

async function LevelComplete(win){
    if(win){
        await swalAlert("You Won!");
        await UpdateLeaderboard();
        window.location.href = "index.html";;   
    }
    else{
        await swalAlert("You Lost...", "Try again next time Soldier o7");
        window.location.href = "index.html";;
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

    let timerID = setInterval(() => {
        const x = UpdateTimer(timeLeft);         // Calls Timer function and returns the time remaining to a temporary variable called 'x'
        timeLeft = Math.ceil(x);                 // Reassigns timeLeft to the value of x (Math.ceil = Rounds up to next largest int)
        if (isFinished) clearInterval(timerID);
        if (timeLeft <= 0) clearInterval(timerID);
    }, 999, timeLeft);                          // when the interval function iterates (every 1000ms/1s), a new value of timeLeft (aka 'x') is passed in and updated.

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

    var check = setInterval(() => {
        totalTimeElapsed += 0.1;
        if (isFinished && timeLeft !== 0) {
            console.log('%c>> Moving To Next Stage...', 'color: #1aacf0;');

            // #region Damage Calculation
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = CalculateWordsPerMin(userInput, wordTime, (timeLeft - timeSubtracted));
            const damageDealt = CalculateDamage(player.Damage, comboList, WPM);
            // #endregion
            DisplayWPM(WPM);
            enemy.damage(damageDealt);

            // Play Audio when player attacks
            if (damageDealt > 0){
                const attack = pAttack.cloneNode()
                attack.volume = 0.2;
                attack.play();
            }

            // --- Prepare for next round! ---
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (enemy.Health <= 0){
                eDeath.volume = 0.3;
                eDeath.play();
                return LevelComplete(true);
            }
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }

        else if (timeLeft <= 0) {
            // Calculate Enemy Damage to Player  
            player.damage(enemy.FailureDamage);

            // Play player damage audio


            // --- Prepare for next round! ---
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)
            if (player.Health <= 0){
                pDeath.volume = 0.3;
                pDeath.play();
                return LevelComplete(false);
            }
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
    }, 100);
}
// #endregion

console.log(localStorageSpace());
eGrowl.volume = 0.3;
eGrowl.play(); // Only when enemy is introduced.
GameLogic();
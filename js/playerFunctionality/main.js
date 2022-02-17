let totalTimeElapsed = 0;
let comboList = []
let isFirstRun = true;

let wordTime = 0;
let entityList = [];
let enemy = new Enemy();
let player = new Player();

//-- Audio --
const eGrowl = new Audio('Assets/audio/EnemyGrowl.wav')
const eDeath = new Audio('Assets/audio/EnemyDeath.wav')
const eAttack = new Audio('Assets/audio/EnemyAttack.wav')
const pAttack = new Audio('Assets/audio/PlayerAttack.wav')
const pDeath = new Audio('Assets/audio/PlayerDeath.wav')
var selected = new Audio('Assets/audio/OptionSelect.wav');
var battleOST = new Audio('Assets/audio/SyncopeBattleOST.wav');

async function LevelComplete(win){
    await delay(2500);
    if(win){
        await swalAlert("You Won!");
        await UpdateLeaderboard();
        window.location.href = "menu.html";
    }
    else{
        await swalAlert("You Lost...", "Try again next time Soldier o7");
        window.location.href = "menu.html";
    } 
}

function playAnimation(animName, duration){
    const animation = $(`lottie-player.bossAnim.${animName}`);
    animation.css("display", "block");

    setTimeout(() => {
        if(animName === "death") animation.removeAttr("loop autoplay")
        else animation.css("display", "none")
    }, duration);
}

function FadeAudio(name,threshold){
    console.log('>> Fading Audio')
    let fade = setInterval(() => {
        name.volume -= 0.015;

        if (name.volume <= threshold) {
            console.log('>> Stopping Audio Fade (Threashold Reached)')
            clearInterval(fade);
        }
    }, 1000);
}

async function parseLocalStorageData(){
    const {retrievedDifficulty, retrievedLevelData, retrievedPlayerData} = retrieveLocalStorage();

    const {DifficultyTimings, Entities} = await getLevelJSON(retrievedLevelData);
    entityList = await getBossJSON(Entities);

    wordTime = DefineWordTime(retrievedDifficulty, DifficultyTimings);
    player = parsePlayerData(retrievedPlayerData);
    enemy = entityList[0];
}

// #region Main Game
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

            playAnimation("damage", 900);

            // Play Audio when player attacks
            if (isFinished){
                const attack = pAttack.cloneNode()
                attack.volume = 0.35;
                attack.play();
            }

            // --- Prepare for next round! ---
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            if (enemy.Health <= 0){
                playAnimation("death", 600);
                eDeath.volume = 0.35;
                eDeath.play();
                FadeAudio(battleOST,0.1);
                return LevelComplete(true);
            }
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }

        else if (timeLeft <= 0) {
            // Calculate Enemy Damage to Player  
            player.damage(enemy.FailureDamage);

            playAnimation("attack", 600);

            // Play player damage audio
            eAttack.volume = 0.35;
            eAttack.play();

            // --- Prepare for next round! ---
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)
            if (player.Health <= 0){
                pDeath.volume = 0.35;
                pDeath.play();
                FadeAudio(battleOST,0.1);
                return LevelComplete(false);
            }
            GameLogic();                         // Recalls function to call API and update new words and stuff
        }
    }, 100);
}
// #endregion

console.log(localStorageSpace());

// #region Initialize Audio
eGrowl.volume = 0.3;
battleOST.volume = 0.25;
battleOST.loop = true;

eGrowl.play();  // Only when enemy is introduced.

setTimeout(() => {  // Wait for growl to finish
    battleOST.play();
}, 500);

$(document).on('click', function(){
    const newSelected = selected.cloneNode() // Duplicates the audio (Allow for overlapping audio)
    newSelected.play();                      // Plays Audio when clicked
})

// #endregion

GameLogic();
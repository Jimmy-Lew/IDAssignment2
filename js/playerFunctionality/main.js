//#region Global Variables
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
//#endregion

async function LevelComplete(win){
    await delay(2500);
    if(win){
        const currentLevel = parseInt(window.localStorage.getItem('levelData'));
        await swalAlert(`You defeated Level-${currentLevel}`);
        if (await getLevelJSON() === currentLevel) {
            await UpdateLeaderboard();
            localStorage.removeItem('timeElapsed'); //Remove Time Elapsed Storage (Rest time to 0 next run)
            window.location.href = "menu.html";
        }
        else{
            window.localStorage.setItem('levelData', currentLevel+1);
            window.location.href = "game.html"; // reload page
        }
        
    }
    else{
        await swalAlert("You Lost...<br><br>", "Try again next time Soldier o7");
        window.location.href = "menu.html";
    } 
}

function playAnimation(animName, duration){
    const animation = $(`video.bossAnim.${animName}`);
    const idle = $('video.bossAnim.Idle')
    idle.hide();
    animation.show();

    setTimeout(() => {
        if(animName === "Death") animation.trigger("pause")
        else {animation.hide(); idle.show();}
    }, duration);
}

function FadeAudio(name,threshold){
    // console.log('>> Fading Audio')
    let fade = setInterval(() => {
        name.volume -= 0.015;
        if (name.volume <= threshold) clearInterval(fade); //console.log('>> Stopping Audio Fade (Threashold Reached)');
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

async function LevelLogic() {
    let userInput;
    let predictedWord;
    let timeSubtracted = 0;
    let isFinished = false;

    if(isFirstRun) await parseLocalStorageData().then(() => {isFirstRun = false});

    DisplayBossTitle(enemy.Name);
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
        totalTimeElapsed = Math.round((totalTimeElapsed + 0.1) * 10) / 10;
        if (isFinished && timeLeft !== 0) {
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            // #region Damage Calculation
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = CalculateWordsPerMin(userInput, wordTime, (timeLeft - timeSubtracted));
            const damageDealt = CalculateDamage(player.Damage, comboList, WPM);
            enemy.damage(damageDealt);
            // #endregion

            if (enemy.Health <= 0){
                playAnimation("Death", 580);
                eDeath.volume = 0.35;
                eDeath.play();
                FadeAudio(battleOST,0.1);
                TimeElapsedStorage(totalTimeElapsed)
                return LevelComplete(true);
            }

            playAnimation("Damage", 1000);

            const attack = pAttack.cloneNode()
            attack.volume = 0.35;
            attack.play();
            
            // --- Prepare for next round! ---
            LevelLogic();                         // Recalls function to call API and update new words and stuff
        }

        if (timeLeft <= 0) {
            clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)

            // Calculate Enemy Damage to Player  
            player.damage(enemy.FailureDamage);

            if (player.Health <= 0){
                pDeath.volume = 0.35;
                pDeath.play();
                FadeAudio(battleOST,0.1);
                return LevelComplete(false);
            }

            playAnimation("Attack", 700);

            eAttack.volume = 0.35;
            eAttack.play();

            // --- Prepare for next round! ---
            LevelLogic();                         // Recalls function to call API and update new words and stuff
        }

        if (totalTimeElapsed % 30 == 0) {
            player.damage(enemy.ConstantDamage);

            if (player.Health <= 0){
                clearInterval(check);                // Stops the Check setInterval from iterating. (breaks)
                pDeath.volume = 0.35;
                pDeath.play();
                FadeAudio(battleOST,0.1);
                return LevelComplete(false);
            }

            playAnimation("Attack", 700);

            eAttack.volume = 0.35;
            eAttack.play();
        }

    }, 100);
}

console.log(localStorageSpace());

// #region Initialize Audio
eGrowl.volume = 0.3;
battleOST.volume = 0.25;
battleOST.loop = true;

eGrowl.play();  // Only when enemy is introduced.

setTimeout(() => {  // Wait for growl to finish
    battleOST.play();
}, 350);

$(document).on('click', function(){
    const newSelected = selected.cloneNode() // Duplicates the audio (Allow for overlapping audio)
    newSelected.play();                      // Plays Audio when clicked
})
// #endregion

LevelLogic();
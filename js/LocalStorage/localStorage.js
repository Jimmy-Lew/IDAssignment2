const levelJSON = "/static/levels.json";
const bossJSON = "/static/bosses.json";

function localStorageSpace() {
    var allStrings = '';
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) + ' KB' : 'Empty (0 KB)';
}

function retrieveLocalStorage(){
    const retrievedDifficulty = window.localStorage.getItem('difficulty'),
          retrievedLevelData = window.localStorage.getItem('levelData'),
          retrievedPlayerData = window.localStorage.getItem('playerData');

    return {retrievedDifficulty, retrievedLevelData, retrievedPlayerData};
}

function DefineWordTime(retrievedDifficulty, difficultyTimings) {
    if (retrievedDifficulty === 0) return difficultyTimings[3]; // 40WPM
    else if (retrievedDifficulty === 1) return difficultyTimings[2]; // 60WPM
    else if (retrievedDifficulty === 2) return difficultyTimings[1]; // 90WPM
    return difficultyTimings[0]; // 100WPM
}

function parsePlayerData(playerData){
    if (playerData[0] === "1") return new Player(10000, 5);
}

async function getLevelJSON(retrievedLevelData){
    let levelNo = `Level-${retrievedLevelData}`;

    let levelRes = await fetch(levelJSON)
    let levelData = await levelRes.json();
    const {DifficultyTimings, Entities} = levelData.Level[levelNo];

    return {DifficultyTimings, Entities};
}

async function getBossJSON(Entities){
    let entityList = [];

    for (entityName of Entities) {
        let entityRes = await fetch(bossJSON)
        let entityData = await entityRes.json();

        const {Health, FailureDamage, ConstantDamage, APICalls} = entityData[entityName]
        let newEntity = new Enemy(Health, FailureDamage, ConstantDamage, APICalls);
        entityList.push(newEntity);
    }

    return entityList;
}
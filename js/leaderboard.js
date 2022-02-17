const key = "620138721b941c73ff39795b"

async function UpdateLeaderboard(){
    let username = window.localStorage.getItem("username");
    if(!CheckUsername(username)) return NewPlayer(username, totalTimeElapsed);
    
    if(!CheckTiming(username, totalTimeElapsed)) return window.location.href = "menu.html";

    await delay(800);
    let hasUpdate = await swalConfirm("Would you like to submit/update your time to the leaderboard?")
    if(!hasUpdate) return window.location.href = "menu.html";

    for(; ;){
        let secretCode = await swalPrompt("Please enter your secret code<br><br>", "[Enter] to submit");
        if (CheckSecretCode(secretCode, username)) return UpdatePlayer(username,totalTimeElapsed,secretCode);
        await swalAlert("Invalid code")
        let isRetry = await swalConfirm("Would you like to try again?");
        if (!isRetry) return window.location.href = "menu.html";;
        console.log("Retrying...")
    }
}

/**
 * @param {string} Username
 * @param {string} totalTimeElapsed Total time elepased
 */
async function NewPlayer(username,totalTimeElapsed){
    // CRUD Operation (C) [POST]
    console.log(`Adding new user (${username}) to Leaderboard DataBase`);
    const secretCode = GenerateCode()

    var jsondata = {"Username": username, 
                    "Time": totalTimeElapsed, 
                    "SecretCode": secretCode};
                    
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://syncope-a0db.restdb.io/rest/leaderboard",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": key,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
        // console.log(response);
    });

    await swalAlert(`
    Note the following information below<br><br>
    
    Username: ${username} <br>
    Secret Code: ${secretCode}<br><br>
    `, "Code used to update profile")
}

/**
 * @param {string} Username
 * @param {string} time elepased
 * @param {string} secretCode 6 chars long
 * @returns {bool} Returns true if username already exists.
 */
async function UpdatePlayer(username,totalTimeElapsed,secretCode){
    
    // Get Object ID
    const userID = GetDBData(`{"Username":"${username}"}`, 1, true)[0]._id;

    // CRUD Operation (U) [PUT]
    var jsondata = {"Username": username, "Time": totalTimeElapsed, "SecretCode": secretCode};
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://syncope-a0db.restdb.io/rest/leaderboard/${userID}`,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": key,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
        // console.log(response);
    });
    await swalAlert(`${username} has been updated`);
}

function CheckTiming(username, totalTimeElapsed){
    const response = GetDBData(`{"Username":"${username}"}`, 1, true)
    if (response[0].Time >= totalTimeElapsed) return false;
    return true;
}

function CheckUsername(username){
    return GetDBData(`{"Username":"${username}"}`, 1, true); // Basically ; if it returns an object/array, it is considered 'truthy'
}

function GenerateCode(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%^()!#@';

    for (let index = 0; index < 6; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // IF (BY ANY CHANCE), it generates an existing key, 
    // it would keep genereating until a unique key is found.
    if (CheckSecretCode(result)) return GenerateCode()
    return result;
}

/**
 * @param {string} SecretCode Code to be checked if it currently exists
 * @param {string} Username Optional, only if checking if username and secret code matches
 * @returns {bool} Returns true if Secret Code already exists.
 */
 function CheckSecretCode(secretCode, username = ''){
    const response = username ? GetDBData() 
                              : GetDBData(`{"Username":"${username}"}`, 1, true); // Get Database Data

    for (let index = 0; index < response.length; index++) {
        if(response[index].SecretCode === secretCode) return true; // Secret Code already exists
    }

    return false; // Secret Code does NOT exist
}

function GetDBData(query = "", noOfResults = "", isSpecific = false){
    // Getting ALL Database Data 
    // GOD BLESS STACKOVERFLOW : https://stackoverflow.com/questions/1457690/jquery-ajax-success-anonymous-function-scope
    // WAS TRYING TO RETURN A VALUE FROM AN ANONYMOUS AJAX FUNCTION AND SPENT 3 HOURS TRYING 🙏
    // Amen 🙏

    // ----- NON-Async Request -----
    var results = '' // Create an empty variable called results (to be modified)
    let url = isSpecific ? `https://syncope-a0db.restdb.io/rest/leaderboard?q=${query}&max=${noOfResults}`
                         : `https://syncope-a0db.restdb.io/rest/leaderboard?max=${noOfResults}`
    jQuery.ajax      // Calling the API and extracting the value ☠
    (
        {
            "async": false,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": 
            {
              "content-type": "application/json",
              "x-apikey": key,
              "cache-control": "no-cache"
            },

            success: function(response){
                results = response
            }
        }
    )
    return results?.length ? results 
                           : false;
}

function PopulateLeaderboard(query = ""){
    // Sort Data (Converts String to Date obj, compare and sort)
    const data = GetDBData(query);
    const sortedData = data.sort( function(a,b){
        var dateA = new Date(a.Time);
        var dateB = new Date(b.Time);
        return dateA - dateB;
    });

    let content =   '<div class="l-user l-header">' +
                        `<p>Pos.</p>` +
                        '<div class="user-data">' +
                            `<p>Username</p>` +
                            `<p>Time</p>`+
                        '</div>' +
                    '</div>';

    // Populate Leaderboard (Only get top 10)
    for (let index = 0; index < 10; index++) {
        var html = '<div class="l-user">' +
                        `<p>${index + 1}.</p>` +
                        '<div class="user-data">' +
                            `<p>${sortedData[index].Username}</p>` +
                            `<p>${new Date(sortedData[index].Time).getMilliseconds()}s</p>`+
                        '</div>' +
                    '</div>';
        
        content += html;
    }

    return content;
}

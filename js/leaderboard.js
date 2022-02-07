const key = "620138721b941c73ff39795b"

function UpdateLeaderboard(){
    if(!confirm("Would you like to submit/update your time to the leaderboard?")) return window.location.replace(`/`);

    let username = prompt("Please enter your username");
    if(!CheckUsername(username)) return NewPlayer(username, totalTimeElapsed);

    if(!confirm("Username already exists. Proceed with your Secret Code?")) return window.location.replace(`/`);

    for(; ;){
        let secretCode = prompt("Enter your secret code (6 Characters Long)");
        if (CheckSecretCode(secretCode, username)) return UpdatePlayer(username,totalTimeElapsed,secretCode);
        alert("Invalid secret code!");
        if (!confirm("Would you like to try again?")) return window.location.replace(`/`);
        console.log("Retying...")
    }
}

/**
 * @param {string} Username
 * @param {string} totalTimeElapsed Total time elepased
 */
 function NewPlayer(username,totalTimeElapsed){
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
        console.log(response);
        alert(`
        Please Screenshot / Note the following information below.
        *Code will be used to update your personal time in the future.

        >> Username: ${username} 
        >> Secret Code: ${secretCode}`)
    });
}

/**
 * @param {string} Username
 * @param {string} time elepased
 * @param {string} secretCode 6 chars long
 * @returns {bool} Returns true if username already exists.
 */
 function UpdatePlayer(username,totalTimeElapsed,secretCode){
    
    // Get Object ID
    const userID = GetDBData(`{"Username": ${username}}`, 1, true)._id

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
    console.log(response);
    });
}

function CheckUsername(username){
    for(;username.length > 15;){ // Checks if username is above 15 chars (max).
            alert("Max characters for a username is 15 characters long.");
            username = prompt("Please enter your username");
    }
    return GetDBData(`{"Username": ${username}}`, 1, true); // Basically ; if it returns an object/array, it is considered 'truthy'
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
                              : GetDBData(`{"Username": ${username}}`, 1, true); // Get Database Data

    for (let index = 0; index < response.length; index++) {
        if(response[index].SecretCode === secretCode) return true; // Secret Code already exists
    }

    return false; // Secret Code does NOT exist
}

function GetDBData(query = "", noOfResults = 1, isSpecific = false){
    // Getting ALL Database Data 
    // GOD BLESS STACKOVERFLOW : https://stackoverflow.com/questions/1457690/jquery-ajax-success-anonymous-function-scope
    // WAS TRYING TO RETURN A VALUE FROM AN ANONYMOUS AJAX FUNCTION AND SPENT 3 HOURS TRYING 🙏

    // ----- NON-Async Request -----
    var results = '' // Create an empty variable called results (to be modified)
    let url = isSpecific ? `https://syncope-a0db.restdb.io/rest/leaderboard?q=${query}&max=${noOfResults}`
                         : `https://syncope-a0db.restdb.io/rest/leaderboard`
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
    return results;
}
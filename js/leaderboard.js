const CORS_API_KEY = "6200cc4d1b941c73ff397925"

function UpdateLeaderboard(){
    if(confirm("Would you like to submit/update your time to the leaderboard?")){

        // Prompt User to enter a username.
        let username = prompt("Please enter your username");
        
        if(CheckUsername(username)){ //If Username Already Exists...
            if(confirm("Username already exists. Proceed with your Secret Code?")){
                
                while (true){
                    let secretCode = prompt("Enter your secret code (6 Characters Long)");
                    if(CheckSecretCode(secretCode, username)){
                        UpdatePlayer(username,totalTimeElapsed,secretCode);
                        break;
                    }
                    else{
                        alert("Invalid secret code!");
                        if(confirm("Would you like to try again?")){
                            console.log("Retying...")
                        } 
                        else{ // Exit to main menu
                            window.location.replace(`/`);
                            break;
                        }
                    } 
                }     
            }
            else{
                alert("Returning to main menu...");
                window.location.replace(`/`); // Returns to main menu.
            }
        }
        else{ //If Username Does *NOT* Exists...
            NewPlayer(username,totalTimeElapsed); // Creates a new User & Alert them the secret code.
            
            setTimeout(() => { // Wait for a bit until DB is updated
                window.location.replace(`/`); // Returns to main menu.
            }, 3000);
            
        }
    }
    else{ // User does not want to submit thier time to Database.
        alert("Returning to main menu...");
        window.location.replace(`/`); // Returns to main menu.
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

    var jsondata = {"Username": username, "Time": totalTimeElapsed, "SecretCode": secretCode};
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://syncope-a0db.restdb.io/rest/leaderboard",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": CORS_API_KEY,
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
    const results = GetDBData()
    var objID = '';
    for (let index = 0; index < results.length; index++) {
        if (username.toLowerCase() === results[index].Username.toLowerCase()) {
            objID = results[index]._id;
        }
    }

    // CRUD Operation (U) [PUT]
    var jsondata = {"Username": username, "Time": totalTimeElapsed, "SecretCode": secretCode};
    var settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://syncope-a0db.restdb.io/rest/leaderboard/${objID}`,
    "method": "PUT",
    "headers": {
        "content-type": "application/json",
        "x-apikey": CORS_API_KEY,
        "cache-control": "no-cache"
    },
    "processData": false,
    "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
    console.log(response);
    });
}


/**
 * @returns {bool} Returns true if username already exists.
 */
function CheckUsername(username){
    // Check Usernames for duplicates, existing.
    const response = GetDBData() // Get Database Data

    for (let index = 0; index < response.length; index++) {
        if(response[index].Username.toLowerCase() === username.toLowerCase()){
            console.log('found')
            return true; // Username already exists
        }
    }
    return false; // Username does NOT exist
}


/**
 * @returns {string} A Secret code that is 6 chars Long
 */
function GenerateCode(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%^()!#@';

    for (let index = 0; index < 6; index++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // IF (BY ANY CHANCE), it generates an existing key, 
    // it would keep genereating until a unique key is found.
    if (CheckSecretCode(result)) { 
        GenerateCode()
    }
    
    return result;
}


/**
 * @param {string} SecretCode Code to be checked if it currently exists
 * @param {string} Username Optional, only if checking if username and secret code matches
 * @returns {bool} Returns true if Secret Code already exists.
 */
function CheckSecretCode(secretCode, username = null){
    const response = GetDBData() // Get Database Data

    if (username !== null) {
        for (let index = 0; index < response.length; index++) {
            // If Username and Secret Code are the same...
            if(response[index].SecretCode === secretCode && response[index].Username.toLowerCase() === username.toLowerCase()){
                return true;
            }
        }
    }
    else{ // Just Check for Duplicate Keys
        for (let index = 0; index < response.length; index++) {
            if(response[index].SecretCode === secretCode){
                return true; // Secret Code already exists
            }
        }
    }
    return false; // Secret Code does NOT exist
}


/**
 * @returns {string[]} Returns Database Data in an Array
 */
function GetDBData(){
    // Getting ALL Database Data 
    // GOD BLESS STACKOVERFLOW : https://stackoverflow.com/questions/1457690/jquery-ajax-success-anonymous-function-scope
    // WAS TRYING TO RETURN A VALUE FROM AN ANONYMOUS AJAX FUNCTION AND SPENT 3 HOURS TRYING 🙏

    // ----- NON-Async Request -----
    var results = '' // Create an empty variable called results (to be modified)
    jQuery.ajax      // Calling the API and extracting the value ☠
    (
        {
            "async": false,
            "crossDomain": true,
            "url": "https://syncope-a0db.restdb.io/rest/leaderboard",
            "method": "GET",
            "headers": 
            {
              "content-type": "application/json",
              "x-apikey": CORS_API_KEY,
              "cache-control": "no-cache"
            },
            success: function(response){
                results = response
            }
        }
    )
    return results;
}
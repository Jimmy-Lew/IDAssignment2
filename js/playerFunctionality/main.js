// #region Main
const GameLogic = async () => {
    // --- Initializing Health (Player & Enemy) & Input field ---
    eHealth = Math.floor(eHealth);

    DisplayPlayerHealth(pHealth);
    DisplayBossHealth(eHealth);
    ClearUserInput();                                   // Clears the input field
    
    let wordMap = await GetWordsAndDefs();
    DisplayWords(wordMap);
    const diffTime = RetrieveDifficultyData(retrievedDifficulty);
    let timeLeft = diffTime;
    

    // --- Runs Timer ---
    let timerID = setInterval(() => {                   // Created an anonymous function to run the code below
        const x = UpdateTimer(timeLeft);                // Calls Timer function and returns the time remaining to a temporary variable called 'x'
        timeLeft = Math.ceil(x);                        // Reassigns timeLeft to the value of x
        if(timeLeft <= 0) clearInterval(timerID);
    },1000,timeLeft);                                   // when the interval function iterates (every 1000ms/1s), a new value of timeLeft (aka 'x') is passed in and updated.

    
    // Makeshift "Loop" (called every second)
    var check = setInterval(() => { 
        const userInput = GetUserInput();
        const predictedWord = AutoPredict(userInput,wordMap);
        const finishStatus = CheckCompletion(userInput,predictedWord);
        
        console.log(`User Input: ${userInput.join("")}`);
        console.log(`Predicted Word: ${predictedWord}`);
        console.log(`Finish: ${finishStatus}`);
        
        if (finishStatus === true && timeLeft !== 0){
            console.log('%c>> Moving To Next Stage...','color: #1aacf0;');

            // Calculate Player Damage 
            comboList.push(CalculateWordComplexity(userInput.join("")));
            const WPM = calcWPM(userInput,diffTime,timeLeft);
            const damageDealt = CalculateDamage(comboList, WPM);
            
            eHealth -= damageDealt;

            // --- Prepare for next round! ---
            clearInterval(timerID);     // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);       // Stops the Check setInterval from iterating. (breaks)
            
            GameLogic();                // Recalls function to call API and update new words and stuff
        }
        else if(timeLeft <= 0) {

            console.log('%c>> You Ran Out Of Time!', 'color: red;');

            // Calculate Enemy Damage to Player  
            pHealth -= 50;
            
            // --- Prepare for next round! ---
            clearInterval(timerID);     // Stops the Timer setInterval from iterating. (breaks)
            clearInterval(check);       // Stops the Check setInterval from iterating. (breaks)
            if(pHealth <= 0) alert('You Lost (L)');
            else GameLogic();                // Recalls function to call API and update new words and stuff
        }
    },100);
}
// #endregion

GameLogic();
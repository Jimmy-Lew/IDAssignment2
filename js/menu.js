var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;

async function startGameWithExistingSession() {
    let isNewGame = await swalConfirm("Start new game?<br><br>", "Overrides previous game")
        
    if (isNewGame){
        window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()))
        window.localStorage.setItem('levelData', 1)
        window.localStorage.setItem('playerData', "1");
    }
    window.location.href = "game.html";
}

async function startGameWithNoExistingSession(){
    await swalAlert("Welcome to Syncope!");
    await displayHelp();
    let username = await swalPrompt("Please enter your username<br><br>", "[Enter] to submit");

    for (; username.length > 15;){
        await swalAlert("Username is too long<br><br>", "Must be less than 15 characters");
        username = await swalPrompt("Please enter your username");
    }

    for (; !/^[A-Za-z\s]*$/.test(username) ;){
        // Regex test (Accepts only A-Z Characters)
        await swalAlert("Username Contains Invalid Characters<br><br>", "Only Alphabatical Characters (A-Z) allowed");
        username = await swalPrompt("Please enter your username");
    }

    window.localStorage.setItem("username", username)
    window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()))
    window.localStorage.setItem('levelData', 1)
    window.localStorage.setItem('playerData', "1");
    
    window.location.href = "game.html";
}

async function displayHelp() {
    const galleryImages = [
        `<img src="Assets/images/pngs/Help-1.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/Help-2.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder2.png" class="swal-gallery">`
    ]

    let imageIndex = 0;
    let isFirstOrLast = "First"
    let isRunning = true

    let isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
    for (; isRunning; ){
        if (isNextOrPreviousImage === ">") imageIndex++;
        if (isNextOrPreviousImage === "<") imageIndex--;
        if (imageIndex === 0) isFirstOrLast = "First"
        else if (imageIndex === galleryImages.length - 1) isFirstOrLast = "Last"
        else isFirstOrLast = ""

        isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
        if (isNextOrPreviousImage === "Escape" || isNextOrPreviousImage === "X") isRunning = false;
    }   
}

$("#Start").on("click", () => {
    if (window.localStorage.getItem("username")) startGameWithExistingSession();
    else startGameWithNoExistingSession();
});

$("#Difficulty").on("click", () => {
    if (difficultyRating === difficulties.length - 1) {
        difficultyRating = -1;
    }
    difficultyRating++;
    $("#Difficulty").text(difficulties[difficultyRating]);
});

$("#Leaderboard").on("click", () => {
    swalLeaderboard(`Leaderboard<br>`,PopulateLeaderboard(), "First");
});

$("#Help").on("click", () => {
    displayHelp();
});

// --- Audio Stuff ---
var ost = new Audio('Assets/audio/SyncopeOST.wav');
var option = new Audio('Assets/audio/OptionHover.wav');
var selected = new Audio('Assets/audio/OptionSelect.wav');

ost.volume = 0.3;   // Adjust Audio Volume
ost.loop = true;
ost.play();         // Needs user interaction to enable audio...

// Hover Over Options
$('li').mouseover(function(){
    const newOption = option.cloneNode() // Duplicates the audio (Allow for overlapping audio)
    newOption.volume = 0.2;              // Adjust Audio Volume
    newOption.play()                     // Plays Audio when hovered over
})

// MouseClick on Options
$(document).on('click', function(){
    const newSelected = selected.cloneNode() // Duplicates the audio (Allow for overlapping audio)
    newSelected.play();                      // Plays Audio when clicked
})
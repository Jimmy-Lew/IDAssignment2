var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;

async function startGameWithExistingSession() {
    let isNewGame = await swalConfirm("Start new game?", "Overrides previous game")
        
    if (isNewGame){
        window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()));
        window.localStorage.setItem('levelData', 1);
        window.localStorage.setItem('playerData', "1");
    }
    window.location.href = "game.html";
}

async function startGameWithNoExistingSession(){
    await swalAlert("Welcome to Syncope!");
    await displayHelp();
    let username = await swalPrompt("Please enter your username", "[Enter] to submit");

    for (; username.length > 15;){
        await swalAlert("Username is too long<br>", "Must be less than 15 characters");
        username = await swalPrompt("Please enter your username");
    }

    window.localStorage.setItem("username", username);
    window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()));
    window.localStorage.setItem('levelData', 1);
    window.localStorage.setItem('playerData', "1");
    
    window.location.href = "game.html";
}

async function displayHelp() {
    const galleryImages = [
        `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder1.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder2.png" class="swal-gallery">`
    ]

    let imageIndex = 0;
    let isFirstOrLast = "First"
    let isRunning = true

    let isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
    for (; isRunning; ){
        if (isNextOrPreviousImage === "Next") imageIndex++;
        if (isNextOrPreviousImage === "Previous") imageIndex--;
        if (imageIndex === 0) isFirstOrLast = "First"
        else if (imageIndex === galleryImages.length - 1) isFirstOrLast = "Last"
        else isFirstOrLast = ""

        isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
        if (isNextOrPreviousImage === "Escape" || isNextOrPreviousImage === "Done") isRunning = false;
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
    console.log("Leaderboard clicked");
});

$("#Help").on("click", () => {
    displayHelp();
});
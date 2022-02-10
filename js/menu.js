var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;

async function startGame() {
    let isNewGame = await swalConfirm("Start new game?", "Overrides previous game")
        
    if (isNewGame){
        window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()));
        window.localStorage.setItem('levelData', 1);
        window.localStorage.setItem('playerData', "1");
    }
    window.location.href = "game.html";
}

async function displayHelp() {
    const galleryImages = [
        `<img src="Assets/images/pngs/placeholder.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder1.png" class="swal-gallery">`,
        `<img src="Assets/images/pngs/placeholder2.png" class="swal-gallery">`
    ]

    let imageIndex = 0;
    let isFirstOrLast = "First"

    let isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
    for (; isNextOrPreviousImage !== "Escape"; ){
        if (isNextOrPreviousImage === "Next") imageIndex++;
        if (isNextOrPreviousImage === "Previous") imageIndex--;
        if (imageIndex === 0) isFirstOrLast = "First"
        else if (imageIndex === galleryImages.length - 1) isFirstOrLast = "Last"
        else isFirstOrLast = ""

        isNextOrPreviousImage = await swalGallery(galleryImages[imageIndex], isFirstOrLast)
    }   
}



$("#Start").on("click", () => {
    startGame();
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
    $("#leaderboard-container").show();
    PopulateLeaderboard();

    // Adding a exit (close) button at the bottom after appending.
    $('#leaderboard-container').append('<button id="close-leaderboard">Close</button>')
    
    $("#close-leaderboard").on("click", () => {
        console.log("close");
        $("#leaderboard-container").hide();
    });
});




$("#Credits").on("click", () => {
    swalAlert('test');
});

$("#Help").on("click", () => {
    displayHelp();
});
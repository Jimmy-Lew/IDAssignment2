var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;
let isNewGame = true;

$("#Start").on("click", () => {
    window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()));
    if (isNewGame){
        window.localStorage.setItem('levelData', 1);
        window.localStorage.setItem('playerData', "1");
    }
    window.location.href = "game.html";
});

$("#Difficulty").on("click", () => {
    if (difficultyRating === difficulties.length - 1) {
        difficultyRating = -1;
    }
    difficultyRating++;
    $("#Difficulty").text(difficulties[difficultyRating]);
});

$("#Leaderboard").on("click", () => {
});

$("#Help").on("click", () => {
    $(".help-container").css("display", "flex");
});

$(".help-container").on("click", () => {
    $(this).css("display", "none");
});

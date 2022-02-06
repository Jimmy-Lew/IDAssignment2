var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;

$("#Start").on("click", () => {
    window.localStorage.setItem('difficulty', $("#Difficulty").text());
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

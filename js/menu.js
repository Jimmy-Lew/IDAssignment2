var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;
$("#Start").on("click", function () {
    window.location.href = "game.html";
});
$("#Difficulty").on("click", function () {
    if (difficultyRating === difficulties.length - 1) {
        difficultyRating = -1;
    }
    difficultyRating++;
    $("#Difficulty").text(difficulties[difficultyRating]);
    window.localStorage.setItem('difficulty', difficulties[difficultyRating]);
});
$("#Leaderboard").on("click", function () {
});
$("#Help").on("click", function () {
    $(".help-container").css("display", "flex");
});
$(".help-container").on("click", function () {
    $(this).css("display", "none");
});

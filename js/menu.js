var difficulties = ["Easy", "Medium", "Hard", "Syncope"];
var difficultyRating = 0;

function isNewGame(){
    let hasLocal = window.localStorage.getItem("levelData");
    if(!hasLocal) return true;
    if(!confirm("Continue from last game?")) return true
}

$("#Start").on("click", () => {
    if (isNewGame()){
        window.localStorage.setItem('difficulty', difficulties.indexOf($("#Difficulty").text()));
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
    console.log("Leaderboard clicked");
});

$("#Help").on("click", () => {
    $(".help-container").css("display", "flex");
    $(".help-body").attr("src", "../Assets/images/pngs/HelpMenu.png")
});

$(".help-container").on("click", function() {
    $(this).css("display", "none");
});

$(document).on("keydown", (e) => {
    if (e.key === "Escape"){
        $(".help-container").css("display", "none");
    }
})
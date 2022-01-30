const difficulties = ["Easy", "Medium", "Hard", "Syncope"];
let difficultyRating = 0;


$(document).ready(function(){
    $("#Start").click(function(){
        window.location.href = "game.html";
    })

    $("#Difficulty").click(function(){
        if (difficultyRating === 3){
            difficultyRating = -1;
        }

        difficultyRating ++;
        $("#Difficulty").text(difficulties[difficultyRating]);
        window.localStorage.setItem('difficulty', difficulties[difficultyRating]);
    })

    $("#Leaderboard").click(function(){

    })

    $("#Help").click(function(){

    })
});
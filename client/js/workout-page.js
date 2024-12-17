retrieveData();  //Get inital load

function retrieveData() {
    // Retrieve the library data and populate on page load
    $.ajax({
        url: exerciseURL + "/read-workouts",
        type: "get",
        success: function(response){
            console.log("response: " + response);
            var data = JSON.parse(response);
            if(data.exercises.length > 0){
                createExerciseTable(data.exercises);
            }
            else{
                noResults();
            }
        },
        error: function(err){
            console.log(err);
        }
    });
}

function noResults(){
    var tableHTML = "<h2>Sorry, your trainer has not added any workouts for you just yet.</h2>";
    $("#exerciseTable").html(tableHTML);
}

function createExerciseTable(exerciseData) {
    console.log(exerciseData);
    
    var tableHTML = "";
    var day = exerciseData[0].workout_plan_id;
    tableHTML += "<tr>";
    console.log(day);
    console.log(exerciseData[0].workout_plan_id)
    tableHTML += "<th>Day " + ((day % 3)) + "</th>";
    for(var i=0; i<exerciseData.length; i++) {
        if(exerciseData[i].workout_plan_id != day){
            tableHTML += "<tr>";
            console.log(day);
            console.log(exerciseData[i].workout_plan_id)
            tableHTML += "<th>Day " + ((day % 3) + 1) + "</th>";
            day++;
        }
        tableHTML += "<tr>";
        tableHTML += "<td>" + exerciseData[i].exercise_name + "</td>";
        tableHTML += "<td>" + exerciseData[i].description + "</td>";
        tableHTML += "<td>" + exerciseData[i].reps + "</td>";
        tableHTML += "</tr>";
    }

    $("#exerciseTable").html(tableHTML);
    
    // activateDelete();
}
/*
function activateDelete() {
    $('.delete-button').click(function(event) {
        console.log("see more about ")
        console.log(event.target)
        // window.location.href="home"
        // let container = document.createElement("div");
        // let p = document.createElement("p");
        // p.innerText = "test";
        // this.after(p);
        // console.log(document.)
        this.innerText = this.innerText == "See More" ? "See Less" : "See More";

        // console.log(this.innerText == "See More")
        // this.after("Text");
    })
}
*/
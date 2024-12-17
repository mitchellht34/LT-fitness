retrieveData();  //Get inital load

function retrieveData() {
    // Retrieve the library data and populate on page load
    $.ajax({
        url: exerciseURL + "/read-workout-plans",
        type: "get",
        success: function(response){
            console.log("response: " + response);
            var data = JSON.parse(response);
            createExerciseTable(data.plans);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function createExerciseTable(exerciseData) {
    console.log(exerciseData);
    
    var tableHTML = "";
    var day = exerciseData[0].workout_plan_id;
    tableHTML += "<tr>";
    console.log(day);
    console.log(exerciseData[0].workout_plan_id)
    tableHTML += "<td>Plan " + exerciseData[0].routine + ": Day " + ((day % 3)) + "</td>";
    for(var i=0; i<exerciseData.length; i++) {
        if(exerciseData[i].workout_plan_id != day){
            tableHTML += "<tr>";
            console.log(day);
            console.log(exerciseData[i].workout_plan_id)
            // tableHTML += "<tr><tr><h1> </h1></tr></tr>";
            // tableHTML += "<th> Plan </th>";
            tableHTML += "<td>Plan " + exerciseData[i].routine + ": Day " + ((day % 3) + 1) + "</td>";
            day++;
        }
        tableHTML += "<tr>";
        tableHTML += "<td>" + exerciseData[i].exercise_name + "</td>";
        tableHTML += "</tr>";
    }

    $("#exerciseTable").html(tableHTML);
    
    // activateDelete();
}
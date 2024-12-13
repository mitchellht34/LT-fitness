retrieveData();  //Get inital load

function retrieveData() {
    // Retrieve the library data and populate on page load
    $.ajax({
        url: exerciseURL + "/read-workouts",
        type: "get",
        success: function(response){
            console.log("response: " + response);
            var data = JSON.parse(response);
            createExerciseTable(data.exercises);
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
    tableHTML += "<td>Day " + ((day % 3)) + "</td>";
    for(var i=0; i<exerciseData.length; i++) {
        if(exerciseData[i].workout_plan_id != day){
            tableHTML += "<tr>";
            console.log(day);
            console.log(exerciseData[i].workout_plan_id)
            tableHTML += "<td>Day " + ((day % 3) + 1) + "</td>";
            day++;
        }
        tableHTML += "<tr>";
        tableHTML += "<td>" + exerciseData[i].exercise_name + "</td>";
        // tableHTML += "<td>" + exerciseData[i].bookTitle + "</td>";
        // tableHTML += "<td>" + exerciseData[i].author + "</td>";
        // tableHTML += "<td>" + exerciseData[i].publisher + "</td>";
        // tableHTML += "<td>" + exerciseData[i].yearPublished + "</td>";
        // tableHTML += "<td>" + exerciseData[i].isbn + "</td>";
        // tableHTML += "<td>" 
        //             +"<button class='btn btn-sm edit_btn delete-button' "
        //             + "data-id='" + exerciseData[i].ID 
        //             + "'>DELETE</button>"
        //             + "</td>";
        tableHTML += "</tr>";
    }

    $("#exerciseTable").html(tableHTML);
    
    // activateDelete();
}
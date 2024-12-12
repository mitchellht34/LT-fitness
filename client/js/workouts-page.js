retrieveData();  //Get inital load

function retrieveData() {
    // Retrieve the library data and populate on page load
    $.ajax({
        url: exerciseURL + "/read-records",
        type: "get",
        success: function(response){
            console.log(response);
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
    for(var i=0; i<exerciseData.length; i++) {
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
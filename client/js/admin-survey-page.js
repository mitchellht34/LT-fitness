retrieveData();  //Get inital load

function retrieveData() {
    // Retrieve the library data and populate on page load
    $.ajax({
        url: exerciseURL + "/read-surveys",
        type: "get",
        success: function(response){
            console.log("response: " + response);
            var data = JSON.parse(response);
            createExerciseTable(data.surveys);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function createExerciseTable(data) {
    console.log("data");
    console.log(data);
    
    var tableHTML = "";
    tableHTML += "<tr>";
    for(var i=0; i<data.length; i++) {
        tableHTML += "<tr>";
        tableHTML += "<td>" + data[i].username + "</td>";
        tableHTML += "<td>" + data[i].experience + "</td>";
        tableHTML += "<td>" + data[i].exp_explained + "</td>";
        tableHTML += "<td>" + data[i].goals_explained + "</td>";
        tableHTML += "<td>" + data[i].goals + "</td>";
        tableHTML += "<td>" + data[i].comfort + "</td>";
        tableHTML += "<td>" + data[i].injuries + "</td>";
        tableHTML += "<td>" + data[i].meal_interest + "</td>";
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
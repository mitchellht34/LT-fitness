let button = document.getElementsByClassName('logout')[0];

button.addEventListener('click', function(event) {
    console.log('clicked')
    logout();
    
})

function logout() {
    console.log('in function')
    $.ajax({
        url: exerciseURL + "/logout",
        type: "get",
        success: function(response){
            console.log("logout");
            // window.location.href='/';
            window.location.replace('/');
        },
        error: function(err){
            console.log(err);
        }
    });
}
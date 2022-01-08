// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if ( username == "student" && password == "student.23264"){
        // window.location = "editor.html"; // Redirecting to other page.
        // properly redirect to editor.html
        window.location.replace("https://timmypidashev.com/editor.html");
        return false;
    }
    else{
        alert("Username/Password is incorrect");
        return false;
    }
}

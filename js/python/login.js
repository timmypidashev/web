function login(username, password) {
    if (username == 'student' && password == 'student.23264') {
        setTimeout(function() { // delay the location.replace for one second for login animation
            location.replace('assignments.html');
        }, 1000);
    } else {
        return false;
    }
}
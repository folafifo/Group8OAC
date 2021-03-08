function handleInput2() {
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    var confirmPassword = document.getElementById('confirmPassword').value
    register(username,password,confirmPassword)
}

async function register(username,password,confirmPassword) {
   //   
   //   Database call. - Check if username is available 
   // 
   if(password.length>7 && password==confirmPassword){
        success.innerHTML = "Congratulations, you have been registered you may now return to login"
        error.innerHTML = ""
        // setTimeout(function(){
        //     window.location.href = "login.html"
        // }) ,90000;
   }
   else{
    error.innerHTML = "Registration failed. Please try again"
   }
   //
   // Database call. - Add username and password to database
   //
}
function handleInput3() {
    window.location.href = "login.html"
}

function handleInput1() {
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    error.innerHTML = ""
    validate(username,password)
    
}

async function validate(username,password) {
   //
   //   Database call. -if username exists in database and password associated matches
   // 
   var valid = true;
   if (valid){
    window.location.href = "home.html";

   }
   else{
    error.innerHTML = "Username or Password is Incorrect."
   }
}
function handleInput4() {
    window.location.href = "register.html"
}


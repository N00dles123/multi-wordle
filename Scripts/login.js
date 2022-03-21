var objPeople = [
    {
        username: "raahym",
        password: "password",
        wins: 0
    }
];



 function login() {
     var user = document.getElementById("email").value;
     var pass = document.getElementById("password").value;
    for(i = 0; i < objPeople.length; i++){
        if(user == objPeople[i].username && pass == objPeople[i].password){
            console.log(user + " is logged in!!");
            document.getElementById("close-btn").classList.remove("hidden");
            return;
        }
    }
    console.log("incorrect username or password");
 }

 function signUp() {
     document.getElementById("registerUser").classList.remove("hidden");
     document.getElementById("registerPass").classList.remove("hidden");
     document.getElementById("register").classList.remove("hidden");
     document.getElementById("signup").classList.add("hidden");
     document.getElementById("email").classList.add("hidden");
     document.getElementById("password").classList.add("hidden");
     document.getElementById("submit").classList.add("hidden");
 }




 function register() {
     var registerUser = document.getElementById("registerUser").value;
     var registerPass = document.getElementById("registerPass").value;
     var newUser = {
         username: registerUser,
         password: registerPass,
         wins: 0
     };

     for(i = 0; i < objPeople.length; i++){
         if(registerUser == objPeople[i].username) {
             alert("that username is already in use");
             return;
         }
         else if(registerPass.length < 8){
             alert("that password is too short (8 or more character)");
             return;
         }
     }
     objPeople.push(newUser);
     //localStorage.setItem("new", newUser);
     console.log(objPeople);
     document.getElementById("registerUser").classList.add("hidden");
     document.getElementById("registerPass").classList.add("hidden");
     document.getElementById("register").classList.add("hidden");
     document.getElementById("signup").classList.remove("hidden");
     document.getElementById("email").classList.remove("hidden");
     document.getElementById("password").classList.remove("hidden");
     document.getElementById("submit").classList.remove("hidden");

 }


 function closeCard(){
     document.getElementById("container").classList.add("hidden");
     loggedIn = true;
 }
 
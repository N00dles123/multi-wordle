<?php
if(isset($_POST["submit"]))
{
    // take data from form
    $userEmail = $_POST["userEmail"];
    $uid = $_POST["uid"];
    $pwd = $_POST["pwd"];
    $pwdRep = $_POST["pwdRep"];

    // control signup with class
    include "../classes/dbh.classes.php";
    include "../classes/signup.classes.php";
    include "../classes/signup-contr.classes.php";
    $signup = new SignupContr($userEmail, $uid, $pwd, $pwdRep);
    // handling errors user signup
    $signup->signupUser();
    // go back to front page
    header("location: ../index.html?error=none");
}
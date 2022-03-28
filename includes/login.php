<?php
if(isset($_POST["submit"]))
{
    // take data from form
    $uid = $_POST["userid"];
    $pwd = $_POST["pwd"];

    // control signup with class
    include "../classes/dbh.classes.php";
    include "../classes/login.classes.php";
    include "../classes/login-contr.classes.php";
    $login = new LoginContr($uid, $pwd);
    // handling errors user signup
    $login->loginUser();
    // go back to front page
    header("location: ../home.php?error=none");
}
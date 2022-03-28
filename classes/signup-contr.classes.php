<?php

class SignupContr extends Signup{
    private $userEmail;
    private $uid;
    private $pwd;
    private $pwdRep;

    public function __construct($userEmail, $uid, $pwd, $pwdRep) {
        $this->userEmail = $userEmail;
        $this->uid = $uid;
        $this->pwd = $pwd;
        $this->pwdRep = $pwdRep; 
    }
    // check for correct username type and correct email type
    public function signupUser() {
        if($this->emptyInput() == false) {
            // echo "Empty input!";
            header("location: ../index.html?error=emptyinput");
            exit();
        }
        if($this->invalidUid() == false) {
            // echo "Invalid username!";
            header("location: ../index.html?error=username");
            exit();
        }
        if($this->invalidEmail() == false) {
            // echo "Invalid email!";
            header("location: ../index.html?error=email");
            exit();
        }
        if($this->passwordMatch() == false) {
            // echo "Invalid email!";
            header("location: ../index.html?error=passwordmatch");
            exit();
        }
        if($this->uidTakenCHeck() == false) {
            // echo "Username or email taken!";
            header("location: ../index.html?error=useroremailtaken");
            exit();
        }
        $this->setUser($this->userEmail, $this->uid, $this->pwd);
    }
    //checks for empty input
    private function emptyInput() {
        $result;
        if(empty($this->userEmail) || empty($this->uid) || empty($this->pwd) || empty($this->pwdRep)) {
            $result = false;
        }
        else {
            $result = true;
        }

        return $result;
    }
    private function invalidUid(){
        $result;
        if(!preg_match("/^[a-zA-Z0-9]*$/", $this->uid)){
            $result = false;
        } else {
            $result = true;
        }
        return $result;
    }
    private function invalidEmail(){
        $result;
        if(!filter_var($this->userEmail, FILTER_VALIDATE_EMAIL)){
            $result = false;
        } else {
            $result = true;
        }
        return $result;
    }
    private function passwordMatch(){
        $result;
        if($this->pwd !== $this->pwdRep){
            $result = false;
        } else {
            $result = true;
        }
        return $result;
    }
    private function uidTakenCheck(){
        $result;
        if(!$this->checkUser($this->uid, $this->userEmail)){
            $result = false;
        } else {
            $result = true;
        }
        return $result;
    }
}
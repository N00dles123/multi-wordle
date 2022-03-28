<?php

class LoginContr extends Login{
    
    private $uid;
    private $pwd;

    public function __construct($uid, $pwd) {
        $this->uid = $uid;
        $this->pwd = $pwd;
    }
    // check for correct username type and correct email type
    public function loginUser() {
        if($this->emptyInput() == false) {
            // echo "Empty input!";
            header("location: ../index.html?error=emptyinput");
            exit();
        }
    
        $this->getUser($this->uid, $this->pwd);
    }
    //checks for empty input
    private function emptyInput() {
        $result;
        if(empty($this->uid) || empty($this->pwd)) {
            $result = false;
        }
        else {
            $result = true;
        }

        return $result;
    }
    
}
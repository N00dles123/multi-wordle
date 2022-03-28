<?php

class Login extends Dbh {
    protected function getUser($uid, $pwd) {
        $stmt = $this->connect()->prepare('SELECT users_pwd FROM users WHERE users_uid = ? OR users_email = ?;');
        
        $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);

        if(!$stmt->execute(array($uid, $pwd))){
            $stmt = null;
            header("location: ../index.html?error=stmtfailed");
            exit();
        }
        if($stmt->rowCount() == 0){
            $stmt = null;
            header("location: ../index.html?error=usernotfound");
            exit();
        }

        $pwdHashed = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $checkPwd = password_verify($pwd, $pwdHashed[0]["users_pwd"]);

        if($checkPwd == false){
            $stmt = null;
            header("location: ../index.html?error=wrongpassword");
            exit();
        } elseif($checkPwd == true) {
            $stmt = $this->connect()->prepare('SELECT * FROM users WHERE users_uid = ? OR users_email = ? AND users_pwd = ?;');
            if(!$stmt->execute(array($uid, $uid, $pwd))){
                $stmt = null;
                header("location: ../index.html?error=stmtfailed");
                exit();
            }
            if($stmt->rowCount() == 0){
                $stmt = null;
                header("location: ../index.html?error=usernotfound");
                exit();
            }

            $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
            session_start();
            $_SESSION["userid"] = $user[0]["users_id"];
            $_SESSION["useruid"] = $user[0]["users_uid"];
        }
        $stmt = null;
        
    }
}
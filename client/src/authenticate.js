import React from 'react';
import jwt_decode from 'jwt-decode'

function authenticate(){
    function isExpired(user){
        var currentDateTime = new Date();
        console.log(user.exp - currentDateTime.getTime()/1000)
        if(user.exp < currentDateTime.getTime()/1000)
            return true;
        else
            return false;
        
    }
    const token = localStorage.getItem('token')
    if(token){
        const user = jwt_decode(token);
        if(isExpired(user)){
            return false;
        } else {
            return true;
        }
        
    } else {
        return false;
    }
}

export default authenticate;
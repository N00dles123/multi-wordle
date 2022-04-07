import React, { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const Dashboard = () => {
    const history = useNavigate()
    const [username, setUsername] = useState();
    // logs out user --still needs some work
    async function logoutUser(event){
        event.preventDefault()
        const response = await fetch('http://localhost:9999/api/user', {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.removeItem('token')
            },
            
        })
        const data = await response.json();
        localStorage.removeItem('token');
        history("/");
    
    }
    async function populateBoard() {
        await fetch('http://localhost:9999/api/user', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        }).then((req) => req.json())
        .then((user) => {
        //console.log(data);
        //const userData = 
            if(user.user !== null){
                //console.log(user.user);
                setUsername(user.user)
            } else {
                alert(user.error)
            }
            //console.log(user.user);
        }); 

        
    }

    useEffect(() => {

        const token = localStorage.getItem('token')
        populateBoard();
        if(token) {
            var user = jwt_decode(token);
            //console.log(user)
            if(user.status === "error"){
                console.log("failed");
                localStorage.removeItem('token')
                history('/default')
            } else {
                //console.log(user.username);
                populateBoard();
            }
        } else {
            history('/default')
        }
    })

    return <div>
        <div><h1>Hello {username}</h1> </div>
        <form onSubmit={logoutUser}>
            <input
                type="submit"
                value="LogOut"
            />
        </form>
        </div>
}

export default Dashboard

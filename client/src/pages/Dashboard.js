import React, { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'




const Dashboard = () => {
    localStorage.setItem('roomcode', "");
    const history = useNavigate()
    const [username, setUsername] = useState('');
    const [wins, setWins] = useState(0);
    const[room, getRoom] = useState('');
    // submits the room code
    async function submitRoom(event){
        event.preventDefault()
        if(room === ""){
            alert("Room code is empty")
            return;
        } else {
            localStorage.setItem('roomcode', room);
            console.log(localStorage.getItem('roomcode'));
            window.location.href = '/game';
        }
    }
    
    
    // logs out user --still needs some work
    async function logoutUser(event){
        console.log("button clicked!")
        event.preventDefault()
        
        localStorage.removeItem('token');
        const response = await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        }) 
        const data = await response.json();
        console.log(data);
        if(data.status === 'ok'){
            alert("Logout Success")
        }
        history("/");
    
    }
    async function populateBoard() {
        await fetch('http://localhost:3001/api/user', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        }).then((req) => req.json())
        .then((user) => {
            //console.log(user.numWins);
            //const userData = 
            if(user.user !== null){
                //console.log(user.user);
                setWins(user.numWins);
                setUsername(user.user)
            } else {
                alert(user.error)
            }
            //console.log(user.user);
        }); 

        
    }
    function isExpired(user){
        var currentDateTime = new Date();
        //console.log(user.exp - currentDateTime.getTime()/1000)
        if(user.exp < currentDateTime.getTime()/1000)
            return true;
        else
            return false;
        
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            var user = jwt_decode(token);
            //console.log(user)
            if(isExpired(user)){
                console.log("expired");
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
        <nav class="top-bar b-b-blue">
            <div class="nav-left" onclick="onNavClick()"> </div>
            <div class="title"> Muldle </div>
            <button class="nav-right" onClick={logoutUser}>Logout</button>
        </nav>
        <div><h1>Hello {username}</h1> </div>
        <div>You have {wins} wins</div>
        <div class="match-container">
            <form class="find-match" onSubmit={submitRoom}>
                <input
                    value={room}
                    onChange={(e) => getRoom(e.target.value)}
                    type="text"
                    placeholder="Enter a room code"
                />
                <input
                    type="submit"
                    value="Join Room"
                />
            </form>
        </div>
        
        </div>
}

export default Dashboard

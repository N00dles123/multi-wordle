import '../index.css'
import Board from '../Components/Board';
import React, { useState, useEffect } from 'react';
import words from '../Components/Words';
import Header from '../Components/Header';
import StatusWindow from '../Components/StatusWindow';
import { GameContext } from '../Components/GameContext';
import io from 'socket.io-client';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const ENDPOINT = "http://localhost:3001"
var socket
const numRows = 6;
const squaresPerRow = 5;
var gameWord;
const roomcode = localStorage.getItem('roomcode');
const token = localStorage.getItem('token')
// holds user username
var userName = "";
var user;
if(token){ 
    user = jwt_decode(token);
    userName = user.username 
}



// game starts when both players are in the same room change up the board effect
var gameStart = false;





const Game = (props) => {
        const history = useNavigate();
        const [answer, setAnswer] = useState(gameWord);
        const [board, setBoard] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill("")));
        const [opponentboard, setOpponentboard] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill("")))
        const [correctLetters, setCorrectLetters] = useState([])   
        const [notQuiteLetters, setNotLetters] = useState([])
        const [letterPos, setLetterPos] = useState(0)
        const [attemptNum, setattemptNum] = useState(0);
        const [gameover, setgameover] = useState(false);
        const [guessedWord , setGuesssedWord] = useState(false)
        const [notify, setNotify] = useState(false)
        const [status, setStatus] = useState("")
        const [joinroom, setjoinRoom] = useState(0);
        const [otherUser, setOtheruser] = useState("");
        // only call once
        const joinRoom =  () => {
            socket = io(ENDPOINT)
            const userData = {
                room: roomcode,
                author: user.username,
            }
            setjoinRoom(1)  
            socket.emit("join_room", userData);
            socket.on("room_capacity", (data) => {
                window.location.href = '/dashboard'
                alert(data.message);
            })
            socket.on("createWord", (data) => {
                gameWord = data.userWord;
                console.log(gameWord)
                gameStart = true;
            })
        }
    
    
    const updateBoard = async () => {
        
        socket.on("gameWin", (data) => {
            alert(data.message)
            history("/dashboard");
        })
        // data will be composed of wordarr which has an array of colors for example [green, black, yellow, green, black], message which is what has occurred
        socket.on("gameOver", (data) => {
            // try to send this array to update opponent board
            var updatedArray = data.wordarr
            alert(data.message +  ". The word was " + data.gameWord)
            history("/dashboard");
        })
        socket.on("wrongWord", (data) => {
            var updatedArray = data.wordarr
            var bull = data.attemptNum;
            console.log(updatedArray + bull);
            // do something based off this array
            // array will consist of "green", "yellow", or "black" array size is 5
        })
        
    }
    // waiting on socket room to tell when theres 2 users in the room
    // create 2 diff socket.on one to use depending on scenarios
    
     
        useEffect(() => { 
                // checks to see if user has a roomcode, if not redirects to dashboard, if they do they continue into the room    
            if(roomcode === ""){
                window.location.href= "/dashboard";
            } else {
                console.log(joinroom)
                if(joinroom === 0){
                    joinRoom();

                }
                const userData = {
                    room: roomcode,
                    author: user.username,
                }
                socket.emit("gameStart", userData);
                socket.on("sendInfo", (data) => {
                    socket.emit("toOtherUser", userData);
                    if(data.opponent !== user.username){
                        console.log(data.opponent)
                        setOtheruser(data.opponent);
                    }
                })
                socket.on("updateUser", (data) => {
                    if(data.status === "start"){
                        if(data.opponent !== user.username){
                            console.log(data.opponent)
                            setOtheruser(data.opponent);
                        }
                    }
                })
                updateBoard();
            }
        }, [io])
    
    function onInputLetter(key){
        if(gameStart){

            if(gameover || letterPos > squaresPerRow - 1) 
            {
                return;
            }
            board[attemptNum][letterPos] = key;
            setBoard(board)
            var letPos = letterPos
            setLetterPos(letPos + 1)
        }
    }
    
    function onEnter() {
        setAnswer(gameWord);
        if(gameStart && attemptNum < numRows){
            if(letterPos !== squaresPerRow) {
                // do something make status appear
                setNotify(true)
                setStatus("Not Enough Letters")
                return;
            }

            let guess = "";
            for(let i = 0; i < squaresPerRow; i++){
                guess += board[attemptNum][i];
            }
            guess = guess.toLowerCase();
            if(guess === answer) {
                setattemptNum(attemptNum + 1)
                setLetterPos(0);
                setgameover(true);
                setGuesssedWord(true);
                setNotify(true);
                setStatus("You Won!!")
            }
            else if(words.has(guess)) {
                // sends word data to backend
                socket.emit("checkWord", {guessWord: guess, userWord: gameWord, username: userName, attempt: attemptNum, room: roomcode})
                updateBoard();
                setattemptNum(attemptNum + 1)
                setLetterPos(0);

                
            }
            else{
                setNotify(true)
                setStatus("Not a valid word");
            }
            return null;
        } else if(gameStart && attemptNum === numRows){

        }
    }

    function onDelete() {
            if(letterPos !== 0 && gameStart) 
            {
                board[attemptNum][letterPos - 1] = '';
                setBoard(board)
                setLetterPos(letterPos - 1);
            }
            
            
    }

    function closeStatus() {
        setNotify(false);
        setStatus('');
    }
    return (
        <div>
            <Header />
            <div id='game-container'>
            <GameContext.Provider
                value={{
                    state: {answer: answer,
                            board: board,
                            opponentboard: opponentboard,
                            correctLetters: correctLetters,
                            notQuiteLetters: notQuiteLetters,
                            letterPos: letterPos,
                            attemptNum: attemptNum,
                            gameover: gameover,
                            guessedWord: guessedWord,
                            notify: notify,
                            status: status,
                        },
                    onInput: onInputLetter,
                    onEnter: onEnter,
                    onDelete: onDelete,}}
                >
                  {notify ? <StatusWindow onClick={closeStatus}
                    statusMsg={status}/> : null}
                      <Board id={'player1-board'} name={userName} playerNum={1}/>
                      <Board id={'player2-board'} name={(otherUser !== "") ? otherUser : "Loading..."} playerNum={2}/>
                    </GameContext.Provider>
                </div>
            </div>
        );
}




//function changes the div color based on letter positioning
// so by using a map we can keep track of how many times each letter appears in real word
// Update keyboard colors
function updateKeyboard(name, color) {
  var key = document.getElementById(name);
  if(key){
    key.style.backgroundColor=color;
  }
}

export default Game;
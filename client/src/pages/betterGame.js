import '../index.css'
import Board from '../Components/Board';
import React from 'react';
import words from '../Components/Words';
import Header from '../Components/Header';
import StatusWindow from '../Components/StatusWindow';
import { GameContext } from '../Components/GameContext';
import io from 'socket.io-client';
import jwt_decode from 'jwt-decode'

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

// this will store opponent username for title
var otherUser;

const joinRoom = async () => {
        
        socket = io(ENDPOINT)
        const userData = {
            room: roomcode,
            author: user.username,
        }  
        await socket.emit("join_room", userData);
        startGame();
        socket.on("room_capacity", (data) => {
            window.location.href = '/dashboard'
            alert(data.message);
        })
}


const updateBoard = async () => {
    
    socket.on("gameWin", (data) => {
        alert(data.message)
    })
    // data will be composed of wordarr which has an array of colors for example [green, black, yellow, green, black], message which is what has occurred
    socket.on("gameOver", (data) => {
        // try to send this array to update opponent board
        var updatedArray = data.wordarr
        alert(data.message +  ". The word was " + data.gameWord)
    })
    socket.on("wrongWord", (data) => {
        var updatedArray = data.wordarr
        console.log(updatedArray);
        // do something based off this array
        // array will consist of "green", "yellow", or "black" array size is 5
    })
    
}
// waiting on socket room to tell when theres 2 users in the room
// create 2 diff socket.on one to use depending on scenarios

const startGame = async () => {
    const userData = {
        room: roomcode,
        author: user.username,
    }
    socket.emit("gameStart", userData);
    socket.on("game_start", (data) => {
        if(data.status === "start"){
           
            socket.emit("toOtherUser", userData);
            if(data.opponent !== user.username){
                console.log(data.opponent)
                otherUser = data.opponent;
            }
        }
    })
    socket.on("updateUser", (data) => {
        if(data.status === "start"){
            if(data.opponent !== user.username){
                console.log(data.opponent)
                otherUser = data.opponent;
            }
        }
    })
    socket.on("createWord", (data) => {
        gameWord = data.userWord;
        //this.setState({ answer: gameWord})
        console.log(gameWord)
        gameStart = true;
    })
}

class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            answer: gameWord,
            board: Array(numRows).fill().map(() => Array(squaresPerRow).fill("")),
            opponentboard: Array(numRows).fill().map(() => Array(squaresPerRow).fill("")),
            correctLetters: [],
            notQuiteLetters: [],
            letterPos: 0,
            attemptNum: 0,
            gameover: false,
            guessedWord: false,
            notify: false,
            status: "",
        };

        this.onInputLetter = this.onInputLetter.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
    }
    
     

    componentDidMount(){
        // checks to see if user has a roomcode, if not redirects to dashboard, if they do they continue into the room    
        if(roomcode === ""){
            window.location.href= "/dashboard";
        } else {
            joinRoom();
            if(otherUser){
                // make changes to opponent board title <----------------- for kyle
            }
        }
        
    }
    onInputLetter(key){
        if(gameStart){
            const {board, letterPos, attemptNum} = this.state;
            if(this.state.gameover || letterPos > squaresPerRow - 1) {return;}
            board[attemptNum][letterPos] = key;
            this.setState({
                board: board,
                letterPos: letterPos + 1
            });
        }
    }
    
    onEnter() {
        const {board, letterPos, attemptNum, answer} = this.state;
        this.setState({answer: gameWord});
        if(gameStart && attemptNum < numRows){
            if(letterPos !== squaresPerRow) {
                // do something make status appear
                this.setState({notify: true, status: "not enough letters"});
                return;
            }

            let guess = "";
            for(let i = 0; i < squaresPerRow; i++){
                guess += board[attemptNum][i];
            }
            guess = guess.toLowerCase();
            if(guess === answer) {
                this.setState({attemptNum: attemptNum + 1,
                    letterPos: 0, gameover: true, guessedWord: true,
                    notify: true, status: "You won!!"});
            }
            else if(words.has(guess)) {
                this.setState({
                    attemptNum: attemptNum + 1,
                    letterPos: 0
                });
                // sends word data to backend
                socket.emit("checkWord", {guessWord: guess, userWord: gameWord, username: userName, attempt: attemptNum, room: roomcode})
                updateBoard();

                
            }
            else{
                this.setState({notify: true, status: 'Not a valid word'});
            }
            return null;
        } else if(gameStart && attemptNum === numRows){

        }
    }

    onDelete() {
            const {board, letterPos, attemptNum} = this.state;
            if(letterPos === 0 && !gameStart) {return;}
            board[attemptNum][letterPos - 1] = '';
            this.setState({
                board: board,
                letterPos: letterPos - 1
            });
    }

    closeStatus() {
        this.setState({notify: false, status: ''});
    }

    render() {
        console.log(localStorage.getItem('roomcode'))
        console.log(this.state.answer);
        return (
            <div>
                <Header />
                <div id='game-container'>
                <GameContext.Provider
                    value={{state: this.state,
                    onInput: this.onInputLetter,
                    onEnter: this.onEnter,
                    onDelete: this.onDelete,}}
                    >
                      {this.state.notify ? <StatusWindow onClick={this.closeStatus}
                        statusMsg={this.state.status}/> : null}
                      <Board id={'player1-board'}  playerNum={1}/>
                      <Board id={'player2-board'}  playerNum={2}/>
                    </GameContext.Provider>
                </div>
            </div>
        );
    }
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
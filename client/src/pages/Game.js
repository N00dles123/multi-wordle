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
var socket, gameRoom
const numRows = 6;
const squaresPerRow = 5;
const roomcode = localStorage.getItem('roomcode');
const user = jwt_decode(localStorage.getItem('token'));
// game starts when both players are in the same room
const gameStart = false;

// this will store username for title
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
}

class Game extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            answer: getRandomWord(),
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
        const {board, letterPos, attemptNum} = this.state;
        if(this.state.gameover || letterPos > squaresPerRow - 1) {return;}
        board[attemptNum][letterPos] = key;
        this.setState({
            board: board,
            letterPos: letterPos + 1
        });
    }

    onEnter() {
        const {board, letterPos, attemptNum, answer} = this.state;
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
        }
        else {
            this.setState({notify: true, status: 'Not a valid word'});
        }
        return null;
    }

    onDelete() {
        const {board, letterPos, attemptNum} = this.state;
        if(letterPos === 0) {return;}
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


// for testing prints random word
//keyboard still needs work incomplete
function getRandomWord(){
    let array = Array.from(words);
    return array[Math.floor(Math.random() * array.length)];
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
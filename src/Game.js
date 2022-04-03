import './index.css'
import Board from './Components/Board';
import React from 'react';
import words from './Words';
import { GameContext } from './GameContext';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: getRandomWord(),
            board: Array(6).fill(Array(5).fill("")),
            opponentboard: Array(6).fill(Array(5).fill("")),
            guessLen: 0,
            guess: "",
            attemptNum: 0,
            gameover: false,
        };
    }

    onInputLetter(key){
        console.log("OninputLetter" + key);
        return null;
        /*if(guessLen > 4) {return;}
        console.log(`key press${key}`);
        let currBoard = this.state.board;
        currBoard[this.state.attemptNum][this.state.guessLen] = key;
        this.setState({board: currBoard, guessLen: guessLen++});
        */
    }

    onEnter() {
        
        return null;
    }

    render() {
      const answer = this.state.answer;
      const board = this.state.board;
        return (
            <div id='game-container'>
              <GameContext.Provider
                value={{board: board,
                keyboard: this.onInputLetter,}}
                >
                  <StatusWindow />
                  <Board id={'player1-board'} playerNum={1}/>
                  <Board id={'player2-board'} playerNum={2}/>
                </GameContext.Provider>
            </div>
        );
    }
}

class StatusWindow extends React.Component {
    render(){
        return (
            <div id='status' className='status_window'>
                <div className='status_content'>
                    <span className='close' onClick={() => closeStatus()}>&times;</span>
                    <p id='status_paragraph'>{"This is a test"}</p>
                </div> 
            </div>
        );
    }
}

//global variables
var loggedIn = true;
var gameStart = true;
var gameWord = getRandomWord();
var userGuess= "";
var numAttempts = 1;

// for testing prints random word
console.log(gameWord);
//keyboard still needs work incomplete
function getRandomWord(){
    let array = Array.from(words);
    return array[Math.floor(Math.random() * array.length)];
}

// if not logged in, letters cannot be added to board
// adds letters to grid based on keyboard events
// still need to add functionality to button keyboard on screen
document.addEventListener('keydown', (event) => {
    var letter = event.key;
    console.log('Key pressed ' + letter);
    verifyKey(letter);
});

//function changes the div color based on letter positioning
// so by using a map we can keep track of how many times each letter appears in real word
function verifyWord(userAttempt, hashmap){
     // check for greens first, then proceed to check for yellows
    for(let i = 0; i < 5; i++){
        let div = document.getElementById('row' + numAttempts + 'box' + (i + 1));
        let guess = userAttempt.charAt(i);
        if(guess === gameWord.charAt(i)){
            div.style.backgroundColor="green";
            updateKeyboard(guess, "green");
            if(hashmap.get(guess) === 1){
                hashmap.delete(guess);
            } else {
                hashmap.set(guess, (hashmap.get(guess) - 1))
            }
        } else if(!hashmap.has(guess)){
            div.style.backgroundColor="red";
        }
    }
    //now checking for yellows
    for(let i = 0; i < 5; i++){
        let div = document.getElementById('row' + numAttempts + 'box' + (i + 1));
        let guess = userAttempt.charAt(i);
        if(hashmap.has(guess)){
            div.style.backgroundColor = "#c9b458";
            updateKeyboard(guess, "#c9b458");
            if(hashmap.get(guess) > 1){
                hashmap.set(guess, (hashmap.get(guess) - 1));
            } else {
                hashmap.delete(guess);
            }
        } else if(!hashmap.has(guess) && div.style.backgroundColor !== "green"){
            div.style.backgroundColor="red"
            updateKeyboard(guess, "red");
        }
    }
}
function verifyKey(name){
    // checks whether these the key pressed fits any of these 3 cases
    if((name === 'Enter' || name === 'Backspace' || isLetter(name)) && loggedIn && gameStart){
        // in enter case, check if theres a 5 letter word inputted by user
        // if not ignore and give message
        if(name === 'Enter'){
            let statusWindow = document.getElementById("status");
            let para = document.getElementById("status_paragraph");
            if(userGuess.length < 5){
                statusWindow.style.display = "block";
                para.textContent = "Not enough letters";
                return;
            } else {
                //create hashmap to keep track of characters and frequency
                let hashmap = new Map();
                for(let i = 0; i < 5; i++){
                    let letter = gameWord.charAt(i);
                    if(hashmap.has(letter)){
                        hashmap.set(letter, hashmap.get(letter) + 1)
                    } else {
                        hashmap.set(letter, 1);
                    }
                }
                if(userGuess === gameWord){
                    for(let x = 0; x < 5; x++){
                        let row = document.getElementById('row' + numAttempts + 'box' + (x + 1));
                        row.style.backgroundColor = "green";
                    }
                    statusWindow.style.display = "block"
                    para.textContent = "You have won the game";
                } else if(!words.has(userGuess)){
                    statusWindow.style.display = "block";
                    para.textContent = "Not in word list!";
                } else {
                    verifyWord(userGuess, hashmap);
                    userGuess = "";
                    numAttempts++;
                }
                if(numAttempts > 6){
                    statusWindow.style.display = "block";
                    para.textContent = ("The word was " + gameWord.toUpperCase());
                }
                return;
            }
        } else if(name === 'Backspace'){
            // cannot backspace if the user hasnt input any letters yet
            if(userGuess.length > 0){
                var div = document.getElementById('row' + numAttempts + 'box' + userGuess.length);
                userGuess = userGuess.slice(0, userGuess.length - 1);
                div.innerHTML = "";
                console.log(userGuess + "\n");
                return;
            }
        } else if(userGuess.length >= 5){
            // cannot type if user guess is at 5 characters
            return;
        } else if(isLetter(name)){
            // appends letter to word and updates div boxes
            userGuess += name;
            var div = document.getElementById('row' + numAttempts + 'box' + userGuess.length);
            div.textContent = name;
            userGuess = userGuess.toLowerCase();
            console.log(userGuess + "\n");
            return;
        } else {
            return;
        }
    }
}
function keyboard(e){
    var name = e.value;
    verifyKey(name);
 }
// function checks whether inputted key is a letter
function isLetter(char){
    return char.length === 1 && char.match(/[a-z]/i);
}

function closeStatus(){
    var statusScreen = document.getElementById("status");
    console.log(statusScreen);
    statusScreen.style.display = "none";
};

// Update keyboard colors
function updateKeyboard(name, color) {
  var key = document.getElementById(name);
  if(key){
    key.style.backgroundColor=color;
  }
}

export default Game;
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
if (token) {
    user = jwt_decode(token);
    userName = user.username
}
var counter = 0;

// game starts when both players are in the same room change up the board effect
var gameStart = false;

const Game = (props) => {
    // Correct Word
    const [answer, setAnswer] = useState(gameWord);
    // Board/Keyboard
    const [board, setBoard] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill("")));
    const [boardColors, setBoardColors] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill("")));
    const [opponentboard, setOpponentboard] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill("")))
    const [correctLetters, setCorrectLetters] = useState([])
    const [notQuiteLetters, setNotQuiteLetters] = useState([])
    // Guess Checking
    const [letterPos, setLetterPos] = useState(0)
    const [attemptNum, setattemptNum] = useState(0);
    const [guessedWord, setGuesssedWord] = useState(false)
    // Gamestate/Notifications
    const [gameover, setgameover] = useState(false);
    const [notify, setNotify] = useState(false)
    const [status, setStatus] = useState("")
    const [joinroom, setjoinRoom] = useState(0);
    // Oponent
    const [otherUser, setOtheruser] = useState("");

    // only call once
    const joinRoom = () => {
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

    const endGame = () => {
        socket.once("gameWin", (data) => {
            counter++;
            if (!gameover && counter === 1) {
                setgameover(true)
                //console.log("Win emitted!")
                //bull = 1;
                alert(data.message)
                window.location.href = "/dashboard"
            }
        })
        // data will be composed of wordarr which has an array of colors for example [green, black, yellow, green, black], message which is what has occurred
        socket.on("gameOver", (data) => {
            // try to send this array to update opponent board
            counter++
            if (!gameover && counter === 1) {
                //bull = 1;
                //console.log("data emitted!")
                setgameover(true);
                var updatedArray = data.wordarr
                alert(data.message + ". The word was " + data.gameWord)
                window.location.href = "/dashboard"
            }
        })
    }

    // Checks if the room has two players inside, and checks the gamestate
    useEffect(() => {
        // checks to see if user has a roomcode, if not redirects to dashboard, if they do they continue into the room    
        if (roomcode === "") {
            window.location.href = "/dashboard";
        } else {
            console.log(joinroom)
            if (joinroom === 0) {
                joinRoom();

            }
            const userData = {
                room: roomcode,
                author: user.username,
            }
            socket.emit("gameStart", userData);
            socket.on("sendInfo", (data) => {
                socket.emit("toOtherUser", userData);
                if (data.opponent !== user.username) {
                    console.log(data.opponent)
                    setOtheruser(data.opponent);
                }
            })
            socket.on("updateUser", (data) => {
                if (data.status === "start") {
                    if (data.opponent !== user.username) {
                        console.log(data.opponent)
                        setOtheruser(data.opponent);
                    }
                }
            })
            // Update the status of player1s board
            socket.on("onPlayer1WrongWord", (data) => {
                console.log("Onplayer1wrongword")
                var updatedArray = data.wordarr;
                var attemptNum = data.attemptNum
                let updatedColors = boardColors
                updatedColors[attemptNum] = updatedArray;
                setBoardColors(updatedColors)
                console.log(boardColors)
                setCorrectLetters(data.correctLetters)
                setNotQuiteLetters(data.notQuiteLetters)
            })

            // Update the status of the opponents board
            socket.on("onOpponentWrongWord", (data) => {
                console.log("On opponent")
                var updatedArray = data.wordarr;
                var attemptNum = data.attemptNum;
                let updatedOpponentColors = opponentboard
                updatedOpponentColors[attemptNum] = updatedArray;
                setOpponentboard(updatedOpponentColors);
            })
            if (!gameover) {
                //find a way to call this only once
                endGame();
            }
        }
    }, [otherUser, gameover, opponentboard])

    function onInputLetter(key) {
        if (gameStart) {

            if (gameover || letterPos > squaresPerRow - 1) {
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
        if (gameStart && attemptNum < numRows) {
            if (letterPos !== squaresPerRow) {
                // do something make status appear
                setNotify(true)
                setStatus("Not Enough Letters")
                return;
            }

            let guess = "";
            for (let i = 0; i < squaresPerRow; i++) {
                guess += board[attemptNum][i];
            }
            guess = guess.toLowerCase();
            if (guess === answer) {
                //setattemptNum(attemptNum + 1)
                setLetterPos(0);
                setgameover(true);
                setGuesssedWord(true);
                setNotify(true);
                setStatus("You Won!!")
            }
            if (words.has(guess)) {
                // sends word data to backend
                socket.emit("checkWord", { guessWord: guess, userWord: gameWord, username: userName, attempt: attemptNum, room: roomcode, correctLetters: correctLetters, notQuiteLetters: notQuiteLetters })
                setattemptNum(attemptNum + 1)
                setLetterPos(0)
            }
            else {
                setNotify(true)
                setStatus("Not a valid word");
            }
            return null;
        } else if (gameStart && attemptNum === numRows) {

        }
    }

    function onDelete() {
        if (letterPos !== 0 && gameStart) {
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
                        state: {
                            answer: answer,
                            board: board,
                            opponentboard: opponentboard,
                            boardColors: boardColors,
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
                        onDelete: onDelete,
                    }}
                >
                    {notify ? <StatusWindow onClick={closeStatus}
                        statusMsg={status} /> : null}
                    <Board id={'player1-board'} name={userName} playerNum={1} />
                    <Board id={'player2-board'} name={(otherUser !== "") ? otherUser : "Loading..."} playerNum={2} />
                </GameContext.Provider>
            </div>
        </div>
    );
}

export default Game;
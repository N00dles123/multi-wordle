import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import Keyboard from './KeyBoard';

const numRows = 6;
const squaresPerRow = 5;

function Square(props) {
    return (
        <div 
            className={(props.playerNum === 1 ?'guess-box ' : 'guest-box ') + props.letterState} 
            id={props.id}>
            {props.letter}
        </div>
    );
}

function Row(props) { 
    const states=['correct', 'notQuite', 'error'];
    const squareState =Array(squaresPerRow).fill('');
    const {answer, attemptNum} = useContext(GameContext).state;
    let correctWord = answer;
    // Set color state of each square
    if(props.rowNum - 1 < attemptNum) {
        var userWord = "";
        // Handle cases for correct characters
        for(let i = 0; i < squaresPerRow; i++){
            const letter = props.board[props.rowNum - 1][i]
            if (letter === answer[i]) {
                squareState[i] = states[0];
                userWord += letter;
                correctWord = correctWord.replace(props.board[props.rowNum-1][i], ' ');
            }
        }
        // Handle for letters that are in the wrong positon
        for(let i = 0; i < squaresPerRow; i++){
            const letter = props.board[props.rowNum - 1][i]
            if(squareState[i] !== states[0] && letter !== '' && correctWord.includes(letter)){
                squareState[i] = states[1];
                correctWord = correctWord.replace(props.board[props.rowNum-1][i], '');
                
            }
            else if(squareState[i] !== states[0] && squareState[i] !== states[1] && userWord !== "     ") {
                squareState[i] = states[2];
            }
        }
    }

    const squares =[];
    for (let i = 0; i < squaresPerRow; i++){
        squares.push(
        <Square 
            id={'row' + props.rowNum + 'box' + (i + 1)}
            playerNum={props.playerNum}
            letter={props.board[props.rowNum - 1][i]}
            letterState={squareState[i]}/>
        );
    }
    return squares;
}

const Board = (props) => { 
    const contextType = useContext(GameContext);
    const {board, opponentboard} = contextType.state;
    const [rows, setRows]= useState([]);
    //const [opponentBoard, setOpponentboard] = useState(Array(numRows).fill().map(() => Array(squaresPerRow).fill(""))) 
    function renderRow(rowNum) {
        
        //setOpponentboard(opponentboard);
        //console.log(this.context.state);
        return(
            <div className='game-row' id={'gamerow' + rowNum}>
                <Row 
                    rowNum={rowNum}
                    playerNum={props.playerNum}
                    board={props.playerNum === 1 ? board : opponentboard}
                />
            </div>
        );
    }
    for(let i = 0; i < numRows; i++){
        rows.push(renderRow(i + 1));
    }
    useEffect (() => {
        
        for(let i = 0; i < numRows; i++){
            rows.push(renderRow(i + 1));
        }
    }, [opponentboard])
    return (
        <div className="board-container">
            <div className="board-title"> {props.name} </div>
            <div className='board' id={props.id}> {rows} </div>
            {props.playerNum === 1 ? <Keyboard /> : null}
        </div>

    );
    
}

export default Board;
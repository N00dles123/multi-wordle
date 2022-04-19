import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";
import Keyboard from './KeyBoard';

const numRows = 6;
const squaresPerRow = 5;

function Square(props) {
    useEffect(() => {
        
    }, [props])
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
    const {answer, opponentboard, boardColors} = useContext(GameContext).state;
    let correctWord = answer;
    useEffect(() => {

    }, props)
    const squares =[];
    for (let i = 0; i < squaresPerRow; i++){
        squares.push(
        <Square 
            id={'row' + props.rowNum + 'box' + (i + 1)}
            playerNum={props.playerNum}
            letter={(props.playerNum === 1) ? props.board[props.rowNum - 1][i] : ""}
            letterState={(props.playerNum === 1) ? boardColors[props.rowNum-1][i] : opponentboard[props.rowNum -1 ][i]}/>
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

export default Board
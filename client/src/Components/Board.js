import React, { useContext } from "react";
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
        // Handle cases for correct characters
        for(let i = 0; i < squaresPerRow; i++){
            const letter = props.board[props.rowNum - 1][i]
            if (letter === answer[i]) {
                squareState[i] = states[0];
                correctWord = correctWord.replace(props.board[props.rowNum-1][i], ' ');
            }
        }
        // Handle for letters that are in the wrong positon
        for(let i = 0; i < squaresPerRow; i++){
            const letter = props.board[props.rowNum - 1][i]
            if(squareState[i] !== states[0] && letter !== '' &&
                correctWord.includes(letter)){
                squareState[i] = states[1];
                correctWord = correctWord.replace(props.board[props.rowNum-1][i], '');
                if(squareState[i] !== states[0] && squareState[i] !== states[1]) {
                    squareState[i] = states[2];
                }
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

class Board extends React.Component { 
    static contextType = GameContext;
    renderRow(rowNum) {
        const {board, opponentboard} = this.context.state;
        return(
            <div className='game-row' id={'gamerow' + rowNum}>
                <Row 
                    rowNum={rowNum}
                    playerNum={this.props.playerNum}
                    board={this.props.playerNum === 1 ? board : opponentboard}
                />
            </div>
        );
    }

    render() {
        const rows = [];
        for(let i = 0; i < numRows; i++){
            rows.push(this.renderRow(i + 1));
        }
        return (
            <div className="board-container">
                <div className="board-title"> {this.props.name} </div>
                <div className='board' id={this.props.id}> {rows} </div>
                {this.props.playerNum === 1 ? <Keyboard /> : null}
            </div>

        );
    }
}

export default Board;
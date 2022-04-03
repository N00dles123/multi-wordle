import React from "react";
import { GameContext } from "../GameContext";
import Keyboard from './KeyBoard';

const numRows = 6;
const squaresPerRow = 5;

function Square(props) {
    const squareStateStyle = ['green', 'red', 'yellow'];
    const {board, rowNum, letterPos} = props;
    const letter = board[rowNum - 1][letterPos];
    //const letter = board[rowNum][letterPos];
    return (
        <div 
            className={props.playerNum === 1 ?'guess-box ' : 'guest-box '} 
            id={props.id}>
            {letter}
        </div>
    );
}

function Row(props) { 
    const squares =[];
    for (let i = 0; i < squaresPerRow; i++){
        squares.push(
        <Square 
            id={'row' + props.rowNum + 'box' + (i + 1)}
            rowNum={props.rowNum}
            playerNum={props.playerNum}
            letterPos={i}
            board={props.board}
            color={'green'} />
        );
    }
    return squares;
}

class Board extends React.Component { 
    static contextType = GameContext;
    renderRow(rowNum) {
        return(
            <div className='game-row' id={'gamerow' + rowNum}>
                <Row 
                    rowNum={rowNum}
                    playerNum={this.props.playerNum}
                    board={this.context.board}
                />
            </div>
        );
    }

    render() {
        console.log(this.context.board);
        const rows = [];
        for(let i = 0; i < numRows; i++){
            rows.push(this.renderRow(i + 1));
        }
        console.log(this.context);

        return (
            <div className="board-container">
                <div className="board-title"> Your Board </div>
                <div className='board' id={this.props.id}> {rows} </div>
                {this.props.playerNum === 1 ? <Keyboard /> : null}
            </div>

        );
    }
}

export default Board;
import React, { useContext } from "react";
import { GameContext } from "./GameContext";
import { useEffect, useState } from "react";

// this is to add functionality to the keyboard, not exactly fully functional yet

function Button(props) {
    const {onEnter, onDelete, onInput} = useContext(GameContext)
    const {correctLetters, notQuiteLetters} = useContext(GameContext).state
    const inputLetter = () => {
        if(props.value === "Enter") {
            onEnter();
        }
        else if (props.value === "Back") {
            onDelete();
        }
        else {
            onInput(props.value);
        }
    };

    let status = "";
    if(correctLetters.includes(props.value.toLowerCase())) { status = 'correct'}
    else if(notQuiteLetters.includes(props.value.toLowerCase())) {status = 'notQuite'}

    return (
        <button 
            value={props.value}
            id={props.value}
            className={'key ' + status}
            onClick={inputLetter}>
                {props.value}
        </button>
    );
}

class Keyboard extends React.Component {
    static contextType = GameContext;
    renderRow(keys) {
        const row = [];
        keys.forEach(element => {
            row.push(<Button value={element}/>)
            });
        
        return (<div className='row'> {row} </div>);
    }

    handleKeyboard(e){
        if(e.key === "Enter") {
            this.context.onEnter();
        } else if(e.key === "Backspace") {
            this.context.onDelete();
        } else {
            console.log(e.key.length);
            if(/^[a-zA-Z]+$/.test(e.key) && e.key.length === 1) {
                this.context.onInput(e.key);
            }
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {this.handleKeyboard(e)});
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', e => {this.handleKeyboard(e)});
    }

    render() {   
        const keys1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
        const keys2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
        const keys3 = ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Back']; 
        return (
            <div id='keyboard'>
                {this.renderRow(keys1)}
                {this.renderRow(keys2)} 
                {this.renderRow(keys3)}
            </div>
        );
    }
}

export default Keyboard
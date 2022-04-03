import React, { useCallback, useContext } from "react";
import { GameContext } from "../GameContext";

function Button(props) {
    
    const inputLetter = () => {
        if(props.value === "ENTER") {
            props.onEnter();
        }
        else if (props.value === "BACK") {
            props.onDelete();
        }
        else {
            props.onClick(props.value);
        }
    };

    return (
        <button 
            value={props.value}
            id={props.value}
            className='key'
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
            row.push(<Button 
                value={element}
                onClick={this.context.keyboard}/>)
        });
        
        return (<div className='row'> {row} </div>);
    }

    handleClick(e) {
        console.log(e + ' pressed');
    }

    handleKeyboard(e){
        if(e.key === "Enter") {
            console.log("Enter!!!!");
        } else if(e.key === "Backspace") {
            console.log("Backspace!!");
        } else {
            console.log('keyboard pressed' + e.key);
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', e => {this.handleKeyboard(e)});
        console.log("HI" + this.context.board);
    }

    render() {   
        const keys1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        const keys2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        const keys3 = ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back']; 
        return (
            <div id='keyboard'>
                {this.renderRow(keys1)}
                {this.renderRow(keys2)} 
                {this.renderRow(keys3)}
            </div>
        );
    }
}

export default Keyboard;
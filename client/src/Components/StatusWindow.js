import React from "react";

function StatusWindow(props) {
    return (
        <div id='status' className={'status_window'}>
            <div className='status_content'>
                <span className={'close'} onClick={props.onClick}>&times;</span>                    
                <p id='status_paragraph'>{props.statusMsg}</p>
            </div> 
        </div>
    );
}

export default StatusWindow;

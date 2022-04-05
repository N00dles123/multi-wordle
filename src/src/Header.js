import React from "react";

export default function Header(props){
    return (
        <nav class="top-bar b-b-blue">
            <div class="nav-left" onclick="onNavClick()"> Nav </div>
            <div class="title"> Muldle </div>
            <button class="nav-right" onclick="onAccountClick()">Account</button>
        </nav>
    );
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import Header from './Header'

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
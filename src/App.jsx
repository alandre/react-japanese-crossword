import React, { Component } from 'react';

import GameContainer from './containers/GameContainer/GameContainer';

import logo from './logo.svg';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <GameContainer />
      </div>
    );
  }
}

export default App;

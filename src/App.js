import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'

class App extends Component {
  render() {
    return (
      <div>
        <Navbarz />
        <Manufacturers />
      </div>
    );
  }
}

export default App;

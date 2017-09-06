import React, { Component } from 'react';

class LoadingScreen extends Component {
  render() {
    let imgStyle = {
      display: 'block',
      margin: '0 auto'
    };
    //
    let bodyStyle = {
      backgroundColor: '#191F26',
      height: '100vh'
    };

    return (
      <div style={bodyStyle}>
        <img style={imgStyle} className="loading" src="https://imgur.com/iaS9EbP.gif" alt="Loading..." />
      </div>
    );
  }
}

export default LoadingScreen;

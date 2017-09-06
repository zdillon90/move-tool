import React, { Component } from 'react';

// This class loads renders a loading screen when a manufacturer is slected.
// It is triggered when the manufacturer is slected while the POs are being
// loaded and formated into the batches.
class LoadingScreen extends Component {
  render() {
    // let imgStyle = {
    //   display: 'block',
    //   margin: '0 auto'
    // };

    // let bodyStyle = {
    //   backgroundColor: '#191F26',
    //   height: '100vh'
    // };

    return (
      <div className="pbmt-loading__container">
        <img className="pbmt-loading__image" src="https://imgur.com/iaS9EbP.gif" alt="Loading..." />
      </div>
    );
  }
}

export default LoadingScreen;

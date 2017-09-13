import React, { Component } from 'react';

/**
 * This class loads renders a loading screen when a manufacturer is slected.
 * It is triggered when the manufacturer is slected while the POs are being
 * loaded and formated into the batches.
 * @type {Class}
 */
class LoadingScreen extends Component {

  /**
   * Loaidng image
   * @return {HTML} render of component
   */
  render() {
    return (
      <div className="pbmt-loading__window">
        <div className="pbmt-loading__container">
          <div className="pbmt-loading__image">
            <img
              src="https://static1.sw-cdn.net/files/cms/brand-resources/spark-on-blue-rgb-20160613.png"
              alt="Loading..."
            />
            <h2 className="pbmt-welcome__image_text">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingScreen;

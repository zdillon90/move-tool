import React, { Component } from 'react';

/**
 * This component shows the color the card is assigned to
 * when in the polishing statuses.
 * @type {Class}
 */
class JarColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.jarColor
    };
  }

  /**
   * Element describing the jar color this
   * card is connected to in the polisher.
   * @returns {HTML}
   */
  render() {
    return(
      <div>
        <span>Jar Color: </span>
        <span style={{
          color: this.state.color,
          fontWeight: 'bold'
        }}>{this.state.color}</span>
      </div>
    )
  }
}

export default JarColor;

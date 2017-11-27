import React, { Component } from 'react';

class JarColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.jarColor
    };
  }

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

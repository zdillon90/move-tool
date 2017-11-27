import React, { Component } from 'react';

class JarColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.jarColor
    };
  }

  // I need to set the state once it haas been moved

  render() {
    return(
      <span>{this.state.color}</span>
    )
  }
}

export default JarColor;

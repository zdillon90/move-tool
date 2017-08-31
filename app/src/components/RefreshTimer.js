import React, { Component } from 'react';

class RefreshTimer extends Component {
  getInitialState() {
    return {
      secondsRemaining: 0
    };
  }
  componentWillUpdate() {
    if (this.props.pos !== null) {
      this.setState({ secondsRemaining: this.props.secondsRemaining });
      this.interval = setInterval(this.tick, 1000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    }
  }
  render() {
    return (
      <p>Seconds Remaining: {this.state.secondsRemaining}</p>
    );
  }
}

export default RefreshTimer;

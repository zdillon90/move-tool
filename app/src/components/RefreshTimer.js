import React, { Component } from 'react';

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsRemaining: 0
    };
  }
  componentDidMount() {
    this.setState({ secondsRemaining: this.props.secondsRemaining });
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      // This pulls in the refresh fuction from the main app. It will trigger
      // the refresh if the timer hits zero.
      this.props.refresh();
      clearInterval(this.interval);
      // TODO: Seperate out into a different function to use in multiple locations
      this.setState({ secondsRemaining: this.props.secondsRemaining });
      this.interval = setInterval(this.tick, 1000);
    }
  }
  render() {
    return (
      <span>{this.state.secondsRemaining}</span>
    );
  }
}

export default CountdownTimer;

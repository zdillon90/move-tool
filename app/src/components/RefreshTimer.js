import React, { Component } from 'react';

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      secondsRemaining: this.props.secondsRemaining
    };
  }
  componentDidMount() {
    // this.setState({ secondsRemaining: this.props.secondsRemaining });
    console.log(this.state.secondsRemaining);
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      this.props.refresh();
      // ^^^ This pulls in the refresh fuction from the main app. It will trigger
      // the refresh of the board data when the timer hits zero.
      clearInterval(this.interval);
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

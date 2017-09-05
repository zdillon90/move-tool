import React from 'react';

var CountdownTimer = React.createClass({
  getInitialState() {
    return {
      secondsRemaining: 0
    };
  },
  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      console.log('0 check');
      this.props.refresh();
      clearInterval(this.interval);
      this.setState({ secondsRemaining: this.props.secondsRemaining });
      this.interval = setInterval(this.tick, 1000);
    }
  },
  componentDidMount() {
    this.setState({ secondsRemaining: this.props.secondsRemaining });
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    return (
      <span>{this.state.secondsRemaining}</span>
    );
  }
});

export default CountdownTimer;

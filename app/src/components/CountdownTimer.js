import React, { Component } from 'react';

/**
 * This class takes care act of rendering the Countdown timer within the navbar.
 * @param  {String} secondsRemaining Sets the begining point of the count down.
 * @return {HTML}                    Render of the countdown in seconds.
 */
class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      secondsRemaining: this.props.secondsRemaining
    };
  }

  /**
   * This function is triggered right after the timer is rendered and sets the
   * interval to tick every second
   */
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  /**
   * Clears the interval when the timer is unmounted from the DOM
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * tick takes care of setting the new state every interval change. It also
   * checks to see if timer has reached 0, if so the timer will reset and send
   * the refresh signal to the main application
   */
  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining === 0) {
      const cardId = this.props.cardId;
      if (cardId !== null && this.props.polishing) {
        this.props.cardAlert(cardId);
        console.log(cardId);
      }
      if (!this.props.polishing && this.state.secondsRemaining <= 0) {
        this.props.refresh();
        // ^^^ This pulls in the refresh function from the main app. It will trigger
        // the refresh of the board data when the timer hits zero.
        clearInterval(this.interval);
        this.setState({secondsRemaining: this.props.secondsRemaining});
        this.interval = setInterval(this.tick, 1000);
      }
    }
  }

  /**
   * Renders out the number of seconds left on the timer
   * @return {HTML} render of component
   */
  render() {
    return (
      <span>{this.state.secondsRemaining}</span>
    );
  }
}

export default CountdownTimer;

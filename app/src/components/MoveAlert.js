import React, { Component } from 'react';
import { Progress } from 'reactstrap';

class MoveAlert extends Component {
  handleFeedback() {
    let result = this.props.result;
    if (result === 'success') {
      return (
        <div>
          <Progress color="success" value="100">Move Successful! You're Awesome!</Progress>
        </div>
      )
    } else if (result === 'failure') {
      return (
        <div>
          <Progress color="danger" value="100">Whoops! There was a problem with the request.</Progress>
        </div>
      )
    } else if (result === 'loading') {
      return (
        <div>
          <Progress color="info" value="100">Loading...</Progress>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }

  render() {
    return (
      this.handleFeedback()
    );
  }
}
export default MoveAlert;

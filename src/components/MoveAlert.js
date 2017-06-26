import React, { Component } from 'react';
import { Progress } from 'reactstrap';

class MoveAlert extends Component {
  handleFeedback() {
    let result = this.props.result;
    console.log(result);
    if (result === "success") {
      return(
        <div>
          <Progress color="success" value="100">Move Successful! You're Awesome!</Progress>
        </div>
      )
    } else {
      return(
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

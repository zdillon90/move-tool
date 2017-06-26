import React, { Component } from 'react';
import { Progress } from 'reactstrap';

class MoveAlert extends Component {
  // timer() {
  //   let counter = 0;
  //   let i = setInterval(function(){
  //
  //     counter++;
  //     if(counter === 10) {
  //       clearInterval(i);
  //     }
  //   }, 200);
  // }

  handleFeedback() {
    let result = this.props.result;
    // let timeOutput = this.timer()
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

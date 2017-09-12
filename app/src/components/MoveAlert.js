import React, { Component } from 'react';
import { Progress } from 'reactstrap';

/**
 * This class renders a userfeedback notice when an action was taken
 * @type {Class}
 */
class MoveAlert extends Component {

  /**
   * Handles the type of userfeedback that is need.
   * @return {HTML} Renders a bar on the top of of the screen depending on the
   * action taken
   */
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

  /**
   * renders the above If statement above
   * @return {HTML} render of component
   */
  render() {
    return (
      this.handleFeedback()
    );
  }
}
export default MoveAlert;

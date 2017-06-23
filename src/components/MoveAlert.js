import React from 'react';
import { Alert } from 'reactstrap';

class MoveAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
        I am an alert and I can be dismissed!
      </Alert>
    );
  }
}

export default MoveAlert;

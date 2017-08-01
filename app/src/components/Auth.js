import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Auth extends Component {
  render() {
    let authLink = this.props.authLink;
    return (
      <div>
        <Button color="danger" href={authLink}>Authorize</Button>
      </div>
    );
  }
}

export default Auth;

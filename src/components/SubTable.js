import React, { Component } from 'react';
// import { Container, Row, Col } from 'reactstrap';

class SubTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let list = this.props.list
    return (
      <div>
        <h3>SubProcess: {list.display_name}</h3>
      </div>
    );
  }
}

export default SubTable;

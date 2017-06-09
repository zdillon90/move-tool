import React, { Component } from 'react';
import SubHeader from './SubHeader'

class SubTable extends Component {
  render() {
    let list = this.props.list
    return (
      <div>
        <SubHeader list={list} />
      </div>
    );
  }
}

export default SubTable;

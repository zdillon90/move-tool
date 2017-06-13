import React, { Component } from 'react';
import SubHeader from './SubHeader';
import SubTableBody from './SubTableBody';

class SubTable extends Component {
  render() {
    let list = this.props.list;
    let pos = this.props.pos;
    return (
      <div>
        <SubTableBody
          sublist={list}
          pos={pos}
          />
      </div>
    );
  }
}

export default SubTable;

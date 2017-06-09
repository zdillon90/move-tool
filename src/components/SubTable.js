import React, { Component } from 'react';
import SubHeader from './SubHeader';
import SubTableBody from './SubTableBody';

class SubTable extends Component {
  render() {
    let list = this.props.list
    return (
      <div>
        <SubHeader list={list} />
        <SubTableBody sublist={list}/>
      </div>
    );
  }
}

export default SubTable;

import React, { Component } from 'react';
import { Table } from 'reactstrap';

class SubHeader extends Component {
  render () {
    let items = this.props.list;
    let subProcesses = items.processSteps;
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            {subProcesses.map(
              item => <th key={item.id}>{item.name}</th>
              )
            }
          </tr>
        </thead>
      </Table>
    );
  }
}

export default SubHeader;

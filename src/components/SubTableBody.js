import React, { Component } from 'react'
import { Board } from 'react-trello'
import { genCards } from './TrayCard'

class SubTableBody extends Component {
  constructor(props) {
    super(props);
    this.makeLanes = this.makeLanes.bind(this);
  }

  makeLanes() {
    let data = {};
    let lanes = 'lanes';
    let colums = [];
    let list = this.props.sublist;
    let subProcesses = list.processSteps;
    let pos = this.props.pos;
    let TrayCards = genCards(pos, subProcesses);
    subProcesses.forEach(function(column) {
      let lane = {};
      let title = 'title';
      let id = 'id';
      let cards = 'cards';
      let columnName = column.name;
      let columnId = column.id;
      lane[title] = columnName;
      lane[id] = columnId;
      // lane[cards] = TrayCards;
      colums.push(lane);
    });
    data[lanes] = colums;
    return data;
  }

  render() {
    let processes = this.makeLanes();
    return (
      <div>
        <Board
          draggable
          data={processes}
        />
      </div>
    );
  }
}

export default SubTableBody;

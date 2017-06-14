import React, {Component} from 'react'
import {Board} from 'react-trello'

class SubTableBody extends Component {
  // constructor(props) {
  //   super(props);
  //   this.makeCards = this.makeCards.bind(this);
  // }

  makeCards(productionOrders, column) {
    let cards = [];
    let id = 'productionTrayId';
    let title = 'productionTrayName';
    // productionOrders.forEach(function(po) {
    //
    // });

    return cards;
  }

  makeLanes() {
    let makeCards = this.makeCards;
    let data = {};
    let lanes = 'lanes';
    let colums = [];
    let list = this.props.list;
    let subProcesses = list.processSteps;
    let pos = this.props.pos;
    let poSubId = pos.subStatusId;
    console.log(list);
    console.log(subProcesses);
    console.log(pos);
    console.log(poSubId);
    subProcesses.forEach(function(column) {
      let lane = {};
      let title = 'title';
      let id = 'id';
      let cards = 'cards';
      let columnName = column.name;
      let columnId = column.id;
      // console.log(columnId);
      // Make new list of pos for each subProcesse and then pass
      // let poListPerSub = []
      // pos.forEach(function(po) {
      //   if (po.productionTrayId) {
      //
      //   }
      // });
      let TrayCards = makeCards(pos, columnId);
      lane[title] = columnName;
      lane[id] = columnId.toString();
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
        <Board draggable data={processes}/>
      </div>
    );
  }
}

export default SubTableBody;

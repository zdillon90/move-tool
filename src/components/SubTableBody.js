import React, {Component} from 'react';
import {Board} from 'react-trello';

class SubTableBody extends Component {

  // TODO Add PO count to each card illistrating how much each card has out of
  // the entire tray

  // TODO Add a timmer for each card and how long it has been in that ststus
  makeCards(productionOrders) {
    let cards = [];
    let trayList = [];
    productionOrders.forEach(function(po) {
      let trayId = po.productionTrayId.toString();
      if (trayList.indexOf(trayId) === -1) {
        trayList.push(trayId);
      }
    });
    trayList.forEach(function(tray) {
      let card = {};
      let poListPerTray = [];
      card.id = tray;
      productionOrders.forEach(function(po) {
        if (po.productionTrayId.toString() === card.id) {
          poListPerTray.push(po);
          if (po.productionTrayId === 0) {
            card.title = "No_Tray_Name"
          } else {
            card.title = po.productionTrayName;
          }
        }
      })
      card.metadata = poListPerTray;
      cards.push(card);
    });
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
    subProcesses.forEach(function(column) {
      let lane = {};
      let lanePos = [];
      let title = 'title';
      let id = 'id';
      let cards = 'cards';
      let columnName = column.name;
      let columnId = column.id;
      pos.forEach(function(po) {
        let statusId = po.subStatusId;
        if (statusId === columnId) {
          lanePos.push(po);
        }
      });
      let TrayCards = new makeCards(lanePos);
      lane[title] = columnName;
      lane[id] = columnId.toString();
      lane[cards] = TrayCards;
      colums.push(lane);
    });
    data[lanes] = colums;
    return data;
  }

  render() {
    let processes = this.makeLanes();
    const handleDragStart = (cardId, laneId) => {
      console.log('drag started')
      console.log(`cardId: ${cardId}`)
      console.log(`laneId: ${laneId}`)
    }

    const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
      console.log('drag ended')
      console.log(`cardId: ${cardId}`)
      console.log(`sourceLaneId: ${sourceLaneId}`)
      console.log(`targetLaneId: ${targetLaneId}`)
    }

    const shouldReceiveNewData = (nextData) => {
      console.log('data has changed')
      console.log(nextData)
    }
    // TODO Create Modal with contained POs
    const onCardClick = (cardId, metadata) => {
      console.log(`Card with id:${cardId} clicked. Has metadata: ${metadata}`);
    }

    return (
      <div>
        <Board
          data={processes}
          draggable={true}
          onDataChange={shouldReceiveNewData}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          onCardClick={onCardClick}
        />
      </div>
    );
  }
}

export default SubTableBody;

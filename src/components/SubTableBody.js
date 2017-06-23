import React, { Component } from 'react';
import { Board } from 'react-trello';
// import { connect, PromiseState } from 'react-refetch'
import CardModal from './CardModal'

// TODO Add PO count to each card illistrating how much each card has out of
// the entire tray

// TODO Add a timmer for each card and how long it has been in that ststus

// TODO Add a tag for each tray size

// TODO Refresh the data after each move

// Add in an alert when the move was made

class SubTableBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      metadata: {},
      cardId: "",
      sourceLaneId: "",
      targetLaneId: "",
      formatedPoPatchList: []
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  makeCards(productionOrders) {
    let cards = [];
    let trayList = [];
    productionOrders.forEach(function(po) {
      let trayId = po.productionTrayId.toString();
      if (trayList.indexOf(trayId) === -1) {
        trayList.push(trayId);
      }
    });
    // Try just having the metadata be the object
    trayList.forEach(function(tray) {
      let card = {};
      let poList = [];
      card.id = tray;
      productionOrders.forEach(function(po) {
        if (po.productionTrayId.toString() === card.id) {
          poList.push(po.productionOrderName);
          if (po.productionTrayId === 0) {
            card.title = "No_Tray_Name"
          } else {
            card.title = po.productionTrayName;
          }
        }
      })
      card.metadata = poList;
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
      let columnName = column.name;
      let columnId = column.id;
      pos.forEach(function(po) {
        let statusId = po.subStatusId;
        if (statusId === columnId) {
          lanePos.push(po);
        }
      });
      let TrayCards = new makeCards(lanePos);
      lane.title = columnName;
      lane.id = columnId.toString();
      lane.cards = TrayCards;
      colums.push(lane);
    });
    data[lanes] = colums;
    return data;
  }

  formatPoPatch() {
    let totalPoList = this.props.pos;
    let sourceLane = this.state.sourceLaneId;
    let card = this.state.cardId;
    let targetLane = this.state.targetLaneId;
    let poPatchList = [];
    totalPoList.forEach(function(po) {
      let poSubStatusId = po.subStatusId.toString();
      let poProductionTrayId = po.productionTrayId.toString();
      if (poSubStatusId === sourceLane && poProductionTrayId === card) {
        let patchPo = {};
        patchPo.productionOrderId = po.productionOrderId;
        patchPo.productionProcessStepId = targetLane;
        poPatchList.push(patchPo);
      }
    })
    return poPatchList;
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
      this.setState({
        cardId: cardId,
        sourceLaneId: sourceLaneId,
        targetLaneId: targetLaneId
      })
      let source = this.state.sourceLaneId;
      let target = this.state.targetLaneId;
      if (source !== target) {
        let formatPoPatch = this.formatPoPatch();
        this.setState({ formatedPoPatchList: formatPoPatch});
        console.log(formatPoPatch);
        this.props.patchPos(formatPoPatch);
      }
    }

    const shouldReceiveNewData = (nextData) => {
      console.log('data has changed')
      console.log(nextData)
    }

    const onCardClick = (cardId, metadata) => {
      this.toggle();
      this.setState({
        metadata: metadata
      });
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
        <CardModal
          isOpen={this.state.modal}
          toggle={this.toggle}
          metadata={this.state.metadata}
        />
      </div>
    );
  }
}

export default SubTableBody;
// export default connect(props => {
//   let patchList = this.props.formatedPoPatchList
//   return {
//     updateStatus: status => ({
//       updateStatusResponse: {
//         url: `foo`,
//         method: 'POST',
//         body: patchList
//       }
//     })
//   }
// })(SubTableBody);

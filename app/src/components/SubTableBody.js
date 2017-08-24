import React, { Component } from 'react';
import { Board } from 'react-trello';
// import { connect, PromiseState } from 'react-refetch'
import CardModal from './CardModal';

// This class organizes the manufacturer statuses and oragnizes the tray cards
// within those specfifc statuses. It also is the main function for the drag
// and drop functionality

class SubTableBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      metadata: {},
      cardId: '',
      sourceLaneId: '',
      targetLaneId: '',
      formatedPoPatchList: []
    };
    this.toggle = this.toggle.bind(this);
    this.totalPoCountPerTray = this.totalPoCountPerTray.bind(this);
  }

  // Takes care of toggleling the Card modal when the card is clicked.
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  // This function creates the PO count for that spacific tray within a cirtian
  // substatus, so if a tray is in two different substatuses the amount in that
  // substatus is compaired to the tray total
  totalPoCountPerTray(productionOrders) {
    const totalTrayListIds = [];
    const totalTrayList = [];
    let poCount = 0;
    productionOrders.forEach((po) => {
      const trayId = po.productionTrayId.toString();
      if (totalTrayListIds.indexOf(trayId) === -1) {
        totalTrayListIds.push(trayId);
      }
    });
    totalTrayListIds.forEach((tray) => {
      const trayObject = {};
      poCount = 0;
      trayObject.trayNumber = tray;
      productionOrders.forEach((po) => {
        const trayId = po.productionTrayId.toString();
        if (trayId === tray) {
          poCount += 1;
        }
      });
      trayObject.poCount = poCount;
      totalTrayList.push(trayObject);
    });
    return totalTrayList;
  }

// This function creates the cards for each substatus
  makeCards(productionOrders, trayTotals) {
    const cards = [];
    const trayList = [];
    productionOrders.forEach((po) => {
      const trayId = po.productionTrayId.toString();
      if (trayList.indexOf(trayId) === -1) {
        trayList.push(trayId);
      }
    });
    trayList.forEach((tray) => {
      const card = {};
      const poList = [];
      const trayTags = [];
      const tag = {};
      card.id = tray;
      let trayPosInLane = 0;
      productionOrders.forEach((po) => {
        if (po.productionTrayId.toString() === card.id) {
          poList.push(po.productionOrderName);
          trayPosInLane += 1;
          if (po.productionTrayId === 0) {
            card.title = 'No_Tray_Name';
          } else {
            card.title = po.productionTrayName;
          }
        }
      });
      // Creation of tags for tray size
      if (~card.title.indexOf('P1')) {
        tag.title = 'P1 - Small';
        tag.bgcolor = '#76448A';
      } else if (~card.title.indexOf('P3')) {
        tag.title = 'P3 - Medium';
        tag.bgcolor = '#239B56';
      } else if (~card.title.indexOf('P7')) {
        tag.title = 'P7 - Large';
        tag.bgcolor = '#E67E22';
      } else if (~card.title.indexOf('RUSH') || ~card.title.indexOf('Rush')) {
        tag.title = 'RUSH';
        tag.bgcolor = '#C70039';
      } else if (~card.title.indexOf('XHD') || ~card.title.indexOf('xhd')) {
        tag.title = 'XHD';
        tag.bgcolor = '#27AE60';
      } else {
        tag.title = 'No Tray Class';
        tag.bgcolor = '#808B96';
      }
      trayTags.push(tag);
      card.tags = trayTags;
      trayTotals.forEach((trayTotal) => {
        if (trayTotal.trayNumber === card.id) {
          card.description = (trayPosInLane + "/" + trayTotal.poCount + " PO(s)").toString()
        }
      });
      card.metadata = poList;
      cards.push(card);
    });
    return cards;
  }

  // This function makes the lines for the table
  makeLanes() {
    const makeCards = this.makeCards;
    const data = {};
    const colums = [];
    const list = this.props.list;
    const subProcesses = list.processSteps;
    const pos = this.props.pos;
    const totals = this.totalPoCountPerTray(pos)
    subProcesses.forEach((column) => {
      const lane = {};
      const lanePos = [];
      const columnName = column.name;
      const columnId = column.id;
      pos.forEach((po) => {
        const statusId = po.subStatusId;
        if (statusId === columnId) {
          lanePos.push(po);
        }
      });
      const TrayCards = makeCards(lanePos, totals);
      lane.title = columnName;
      lane.id = columnId.toString();
      lane.cards = TrayCards;
      colums.push(lane);
    });
    data.lanes = colums;
    return data;
  }

  // If a card is moved this function patches the POs to the new substatus
  formatPoPatch() {
    let totalPoList = this.props.pos;
    let sourceLane = this.state.sourceLaneId;
    let card = this.state.cardId;
    let targetLane = this.state.targetLaneId;
    let poPatchList = [];
    totalPoList.forEach((po) => {
      let poSubStatusId = po.subStatusId.toString();
      let poProductionTrayId = po.productionTrayId.toString();
      if (poSubStatusId === sourceLane && poProductionTrayId === card) {
        let patchPo = {};
        patchPo.productionOrderId = po.productionOrderId;
        patchPo.productionProcessStepId = targetLane;
        poPatchList.push(patchPo);
      }
    });
    return poPatchList;
  }

  // This function renders the entire table with the lanes and cards populated
  render() {
    const processes = this.makeLanes();

    const handleDragStart = (cardId, laneId) => {
      console.log('drag started');
      console.log(`cardId: ${cardId}`);
      console.log(`laneId: ${laneId}`);
    };

    const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
      console.log('drag ended');
      console.log(`cardId: ${cardId}`);
      console.log(`sourceLaneId: ${sourceLaneId}`);
      console.log(`targetLaneId: ${targetLaneId}`);
      this.setState({
        cardId,
        sourceLaneId,
        targetLaneId
      });
      let source = this.state.sourceLaneId;
      let target = this.state.targetLaneId;
      if (source !== target) {
        let formatPoPatch = this.formatPoPatch();
        this.setState({ formatedPoPatchList: formatPoPatch });
        this.props.patchPos(formatPoPatch);
      }
    };

    const shouldReceiveNewData = (nextData) => {
      console.log('data has changed');
      console.log(nextData);
    };

    const onCardClick = (cardId, metadata) => {
      this.toggle();
      this.setState({
        metadata
      });
    };

    return (
      <div>
        <Board
          data={processes}
          style={
            { backgroundColor: '#183643', paddingTop: 10, paddingLeft: 10 }
          }
          draggable
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

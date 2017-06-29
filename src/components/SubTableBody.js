import React, { Component } from 'react';
import { Board } from 'react-trello';
// import { connect, PromiseState } from 'react-refetch'
import CardModal from './CardModal'

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

  totalPoCountPerTray(productionOrders) {
    let totalTrayListIds = [];
    let totalTrayList = [];
    let poCount = 0;
    productionOrders.forEach(function(po) {
      let trayId = po.productionTrayId.toString();
      if (totalTrayListIds.indexOf(trayId) === -1) {
        totalTrayListIds.push(trayId)
      }
    })
    totalTrayListIds.forEach(function(tray) {
      let trayObject = {};
      poCount = 0;
      trayObject.trayNumber = tray;
      productionOrders.forEach(function(po) {
        let trayId = po.productionTrayId.toString()
        if (trayId === tray) {
          poCount++;
        }
      })
      trayObject.poCount = poCount;
      totalTrayList.push(trayObject);
    })
    return totalTrayList;
  }

  makeCards(productionOrders, trayTotals) {
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
      let poList = [];
      let trayTags = [];
      let tag = {};
      card.id = tray;
      let trayPosInLane = 0;
      productionOrders.forEach(function(po) {
        if (po.productionTrayId.toString() === card.id) {
          poList.push(po.productionOrderName);
          trayPosInLane++;
          if (po.productionTrayId === 0) {
            card.title = "No_Tray_Name"
          } else {
            card.title = po.productionTrayName;
          }
        }
      })
      // Creation of tags for tray size
      if (~card.title.indexOf('P1')) {
          tag.title = "P1 - Small"
          tag.bgcolor = '#76448A'
      } else if (~card.title.indexOf('P3')) {
          tag.title = "P3 - Medium"
          tag.bgcolor = '#239B56'
      } else if (~card.title.indexOf('P7')) {
          tag.title = "P7 - Large"
          tag.bgcolor = '#E67E22'
      } else if (~card.title.indexOf('RUSH') || ~card.title.indexOf('Rush')) {
        tag.title = "RUSH"
        tag.bgcolor = '#C70039'
      } else if (~card.title.indexOf('XHD') || ~card.title.indexOf('xhd')) {
        tag.title = "XHD"
        tag.bgcolor = '#27AE60'
      } else {
        tag.title = "No Tray Class"
        tag.bgcolor = '#808B96'
      }
      trayTags.push(tag);
      card.tags = trayTags
      trayTotals.forEach(function(trayTotal) {
        if (trayTotal.trayNumber === card.id) {
          card.description = (trayPosInLane + "/" + trayTotal.poCount + " PO(s)").toString()
        }
      });
      card.metadata = poList;
      cards.push(card);
    });
    return cards;
  }

  makeLanes() {
    let makeCards = this.makeCards;
    let data = {};
    let colums = [];
    let list = this.props.list;
    let subProcesses = list.processSteps;
    let pos = this.props.pos;
    let totals = this.totalPoCountPerTray(pos)
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
      let TrayCards = new makeCards(lanePos, totals);
      lane.title = columnName;
      lane.id = columnId.toString();
      lane.cards = TrayCards;
      colums.push(lane);
    });
    data.lanes = colums;
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
      // console.log('drag started')
      // console.log(`cardId: ${cardId}`)
      // console.log(`laneId: ${laneId}`)
    }

    const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
      // console.log('drag ended')
      // console.log(`cardId: ${cardId}`)
      // console.log(`sourceLaneId: ${sourceLaneId}`)
      // console.log(`targetLaneId: ${targetLaneId}`)
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
        // console.log(formatPoPatch);
        this.props.patchPos(formatPoPatch);
      }
    }

    const shouldReceiveNewData = (nextData) => {
      // console.log('data has changed')
      // console.log(nextData)
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

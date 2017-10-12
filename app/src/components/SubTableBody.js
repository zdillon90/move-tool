import React, { Component } from 'react';
import { Board } from 'react-trello';
import CardModal from './CardModal';

/** TODO Organize Tray Cards by machine type */

let eventBus = undefined

/**
 * This class takes the POs endpoint from the InshapeAPI and organizes it into
 * batches and then renders out those batches into lanes that represent
 * sub statuses within Inshape
 * @param  {Bool}   modal               If true, shows the modal of the list of
 * POs if the card is clicked.
 * @param  {Object} metadata            Handles the PO information from the
 * InshapeAPI if a card is clicked.
 * @param  {String} cardId              The unique card identifier
 * @param  {String} sourceLaneId        The unique source lane identifier
 * @param  {String} targetLaneId        The unique target lane identifier
 * @param  {List}   formatedPoPatchList POs to have statuses changed after a
 * card was moved to a new status
 * @type {Class}
 */
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

  /**
   * When the component is updated it will check to see if the refresh signal is
   * true, if so it will re-render the table with the new data from the
   * InshapeAPI
   */
  componentWillUpdate() {
    let signal = this.props.refreshSignal;
    if (signal) {
      let newData = this.makeLanes();
      eventBus.publish({ type: 'REFRESH_BOARD', data: newData },
        this.props.resetRefresh()
      );
    }
  }

  setEventBus = (handle) => {
    eventBus = handle;
  }

  /**
   * Takes care of toggling the Card modal when the card is clicked.
   */
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  /**
   * This function creates the PO count for that specific tray within a certain
   * sub status, so if a tray is in two different sub statuses the amount in that
   * sub status is compared to the tray total
   * @param  {List} productionOrders manufacturer specific POs
   * @return {List}                  POs within a specific tray
   */
  totalPoCountPerTray(productionOrders) {
    let totalTrayListIds = [];
    let totalTrayList = [];
    let poCount = 0;
    productionOrders.forEach((po) => {
      let trayId = po.productionTrayId.toString();
      if (totalTrayListIds.indexOf(trayId) === -1) {
        totalTrayListIds.push(trayId);
      }
    });
    totalTrayListIds.forEach((tray) => {
      let trayObject = {};
      poCount = 0;
      trayObject.trayNumber = tray;
      productionOrders.forEach((po) => {
        let trayId = po.productionTrayId.toString();
        if (trayId === tray) {
          poCount += 1;
        }
      });
      trayObject.poCount = poCount;
      totalTrayList.push(trayObject);
    });
    return totalTrayList;
  }

/**
 * This function creates the cards for each substatus column
 * @param  {List} productionOrders manufacturer specific POs
 * @param  {List} trayTotals       PO totals from a specific tray
 * @return {List}                  Tray Cards that belong to that substatus
 * column
 */
  makeCards(productionOrders, trayTotals) {
    let cards = [];
    let trayList = [];
    productionOrders.forEach((po) => {
      let trayId = po.productionTrayId.toString();
      if (trayList.indexOf(trayId) === -1) {
        trayList.push(trayId);
      }
    });
    trayList.forEach((tray) => {
      let card = {};
      let cardMeta = {};
      let poList = [];
      let trayTags = [];
      let tag = {};
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
      if (~card.title.indexOf('P7')) {
        tag.title = 'P7 - Large';
        tag.bgcolor = '#E67E22';
      } else if (~card.title.indexOf('P3')) {
        tag.title = 'P3 - Medium';
        tag.bgcolor = '#239B56';
      } else if (~card.title.indexOf('P1')) {
        tag.title = 'P1 - Small';
        tag.bgcolor = '#76448A';
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
          card.description = (trayPosInLane + " / " + trayTotal.poCount + " PO(s)").toString()
        }
      });
      /** @TODO Add poList to the card meta */
      cardMeta.poList = poList;
      cardMeta.trayName = card.title;
      card.metadata = cardMeta;
      cards.push(card);
    });
    return cards;
  }

  /**
   * This function makes the sub status columns for the production table.
   * @return {Object} formated object containing tray cards and sub status columns
   */
  makeLanes() {
    let makeCards = this.makeCards;
    let data = {};
    let columns = [];
    let list = this.props.list;
    let subProcesses = list.processSteps;
    let pos = this.props.pos;
    let totals = this.totalPoCountPerTray(pos)
    subProcesses.forEach((column) => {
      let lane = {};
      let lanePos = [];
      let columnName = column.name;
      let columnId = column.id;
      pos.forEach((po) => {
        let statusId = po.subStatusId;
        if (statusId === columnId) {
          lanePos.push(po);
        }
      });
      const TrayCards = makeCards(lanePos, totals);
      lane.title = columnName;
      lane.id = columnId.toString();
      lane.cards = TrayCards;
      columns.push(lane);
    });
    data.lanes = columns;
    return data;
  }

  /**
   * If a tray card is moved this function patches the POs to the new sub status
   * within Inshape
   * @return {List} POs to be moved to new status
   */
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

  /**
   * Complete formated table render function with sub status lanes and tray
   * cards included
   * @return {HTML} render of component
   */
  render() {

    const processes = this.makeLanes();

    const handleDragStart = (cardId, laneId) => {};

    /**
     * This function is triggered when the card is placed and checks to see if
     * the card was moved to a different lane. If the card was placed in a new
     * lane it patches those POs to the new status
     * @param  {String} cardId       The unique card identifier
     * @param  {String} sourceLaneId The unique source lane identifier
     * @param  {String} targetLaneId The unique target lane identifier
     */
    const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
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

    /**
     * Function that is triggered when the card is clicked. This will show the
     * list of POs within the tray card.
     * @param  {String} cardId   The unique card identifier
     * @param  {Object} metadata   POs within the tray card
     */
    const onCardClick = (cardId, metadata) => {
      this.toggle();
      this.setState({
        metadata
      });
    };

    return (
      <div>
        <CardModal
          isOpen={this.state.modal}
          toggle={this.toggle}
          metadata={this.state.metadata}
        />
        <Board
          data={processes}
          eventBusHandle={this.setEventBus}
          draggable
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          onCardClick={onCardClick}
        />
      </div>
    );
  }
}

export default SubTableBody;

import React, { Component } from 'react';
import { Board } from 'react-trello';
import CardModal from './CardModal';
import CountdownTimer from './CountdownTimer';
import PolishingCard from './PolishingCard';
import JarColor from './JarColor';

let eventBus = undefined;

/**
 * This class takes the POs endpoint from the InshapeAPI and organizes it into
 * batches and then renders out those batches into lanes that represent
 * sub statuses within Inshape
 * @param  {Boolean} modal               If true, shows the modal of the list of
 * POs if the card is clicked.
 * @param  {Object} metadata            Handles the PO information from the
 * InshapeAPI if a card is clicked.
 * @param  {String} cardId              The unique card identifier
 * @param  {String} sourceLaneId        The unique source lane identifier
 * @param  {String} targetLaneId        The unique target lane identifier
 * @param  {Object} formatedPoPatchList POs to have statuses changed after a
 * card was moved to a new status
 * @type {Class}
 */
class PolishingBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      metadata: {},
      cardId: '',
      sourceLaneId: '',
      targetLaneId: '',
      formatedPoPatchList: [],
      refreshSignal: false,
      doneCards: [],
      availableJarColors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],
      inUseJarColors: [],
      currentJarColor: ''
    };
    this.toggle = this.toggle.bind(this);
    this.cardAlert = this.cardAlert.bind(this);
    this.polishingTimer = this.polishingTimer.bind(this);
    this.wsfpPolishingTimer = this.wsfpPolishingTimer.bind(this);
    this.premiumPolishingTimer = this.premiumPolishingTimer.bind(this);
    this.assignJarColor = this.assignJarColor.bind(this);
    this.renderJarColor = this.renderJarColor.bind(this);
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
  };

  /**
   * Takes care of toggling the Card modal when the card is clicked.
   */
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  /** @TODO When the card is moved into a polishing status change the color of
   * the card and when it is out  */
  cardAlert(cardId) {
    this.setState({
      doneCard: this.state.doneCards.push(cardId)
    })
  }

  polishingTimer() {
    return (
      <CountdownTimer
        secondsRemaining="10"
        cardAlert={this.cardAlert}
        polishing
      />
    );
  }

  wsfpPolishingTimer() {
    return (
      <CountdownTimer
        secondsRemaining="20"
        cardAlert={this.cardAlert}
        polishing
      />
    );
  }

  premiumPolishingTimer() {
    return (
      <CountdownTimer
        secondsRemaining="30"
        cardAlert={this.cardAlert}
        polishing
      />
    );
  }

  assignJarColor() {
    console.log('Assigning Jar Color');
    let cardIdTotal = this.state.cardId;
    let inUseJarColors = this.state.inUseJarColors;
    let availableJarColors = this.state.availableJarColors;
    console.log(cardIdTotal);
    let cardIdList = cardIdTotal.split(':');
    let cardMaterial = cardIdList[0];
    console.log(cardMaterial);
    let jarIndex = 0;
    let jarColor = availableJarColors[jarIndex];
    inUseJarColors.push(jarColor);
    availableJarColors.splice(jarIndex, 1);
    console.log(jarColor);
    console.log(inUseJarColors);
    console.log(availableJarColors);
    if (inUseJarColors.length > 0) {
      let lastColor = inUseJarColors[inUseJarColors.length - 1];
      this.setState({
        currentJarColor: lastColor
      })
    }
  }

  renderJarColor() {
      return (
        <JarColor
          jarColor={this.state.currentJarColor}
        />
      )
  }

  makeCards(productionOrders, columnLaneId) {
    const wsfpId = 62;
    const bsfId = 25;
    let cards = [];
    let materialList = [];
    let wsfpTrayList = [];
    let bsfTrayList = [];
    productionOrders.forEach((po) => {
      let cardId = po.materialId;
      let trayId = po.productionTrayId.toString();
      if (materialList.indexOf(cardId) === -1) {
        materialList.push(cardId)
      }
      if (wsfpTrayList.indexOf(trayId) === -1 && cardId === wsfpId) {
        wsfpTrayList.push(trayId);
      }
      if (bsfTrayList.indexOf(trayId) === -1 && cardId === bsfId){
        bsfTrayList.push(trayId);
      }
    });
    wsfpTrayList.forEach((tray) => {
      let card = {};
      let cardMeta = {};
      let poList = [];
      let materialTags = [];
      let tag = {};
      card.id = `${wsfpId}:${tray}:${columnLaneId}`;
      card.material = wsfpId;
      let posInTray = 0;
      productionOrders.forEach((po) => {
        if (po.productionTrayId.toString() === tray) {
          poList.push(po.productionOrderName);
          posInTray += 1;
          if (po.productionTrayId === 0) {
            card.title = 'No_Tray_Name';
          } else {
            card.title = `${po.productionTrayName}`;
          }
        }
      });
      tag.title = 'WSFP';
      tag.bgcolor = '#B8B8B8';
      materialTags.push(tag);
      card.description = `${posInTray} PO(s)`;
      card.laneId = columnLaneId;
      card.tags = materialTags;
      cardMeta.poList = poList;
      cardMeta.materialName = card.title;
      card.metadata = cardMeta;
      cards.push(card);
    });
    bsfTrayList.forEach((tray) => {
      let card = {};
      let cardMeta = {};
      let poList = [];
      let materialTags = [];
      let tag = {};
      card.id = `${bsfId}:${tray}:${columnLaneId}`;
      card.material = bsfId;
      let posInTray = 0;
      productionOrders.forEach((po) => {
        if (po.productionTrayId.toString() === tray) {
          poList.push(po.productionOrderName);
          posInTray += 1;
          if (po.productionTrayId === 0) {
            card.title = 'No_Tray_Name';
          } else {
            card.title = `${po.productionTrayName}`;
          }
        }
      });
      tag.title = 'BSF';
      tag.bgcolor = '#000000';
      materialTags.push(tag);
      card.description = `${posInTray} PO(s)`;
      card.laneId = columnLaneId;
      card.tags = materialTags;
      cardMeta.poList = poList;
      cardMeta.materialName = card.title;
      card.metadata = cardMeta;
      cards.push(card);
    });
    materialList.forEach((material) => {
      if (material !== wsfpId && material !== bsfId) {
        let card = {};
        let cardMeta = {};
        let poList = [];
        let materialTags = [];
        let tag = {};
        card.id = `${material}:noTray:${columnLaneId}`;
        card.material = material;
        let posInLane = 0;
        productionOrders.forEach((po) => {
          if (po.materialId === card.material) {
            poList.push(po.productionOrderName);
            posInLane += 1;
          }
        });
        if (card.material === 6) {
          card.title = 'White';
          tag.title = 'WSF';
          card.bgcolor = '#FFFFFF';
        } else if (card.material === 25) {
          card.title = 'Black';
          tag.title = 'BSF';
          tag.bgcolor = '#000000';
        } else if (card.material === 75) {
          card.title = 'Purple';
          tag.title = 'PSFP';
          tag.bgcolor = '#800080';
        } else if (card.material === 76) {
          card.title = 'Red';
          tag.title = 'RSFP';
          tag.bgcolor = '#b30000';
        } else if (card.material === 77) {
          card.title = 'Pink';
          tag.title = 'PSFP';
          tag.bgcolor = '#FFC0CB';
        } else if (card.material === 78) {
          card.title = 'Blue';
          tag.title = 'BSFP';
          tag.bgcolor = '#0000FF';
        } else if (card.material === 93) {
          card.title = 'Yellow';
          tag.title = 'YSFP';
          tag.color = '#000000';
          tag.bgcolor = '#FFFF00';
        } else if (card.material === 94) {
          card.title = 'Green';
          tag.title = 'GSFP';
          tag.bgcolor = '#008000';
        } else if (card.material === 95) {
          card.title = 'Orange';
          tag.title = 'OSFP';
          tag.bgcolor = '#FFA500';
        } else if (card.material === 133) {
          card.title = 'White Premium';
          tag.title = 'WPSF';
          tag.bgcolor = '#808080';
        } else if (card.material === 134) {
          card.title = 'Black Premium';
          tag.title = 'BPSF';
          tag.bgcolor = '#363636';
        }
        materialTags.push(tag);
        card.description = `${posInLane} PO(s)`;
        card.laneId = columnLaneId;
        card.tags = materialTags;
        cardMeta.poList = poList;
        cardMeta.materialName = card.title;
        card.metadata = cardMeta;
        cards.push(card);
      }
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
      const materialCards = makeCards(lanePos, columnId);
      lane.title = columnName;
      lane.id = columnId.toString();
      lane.cards = materialCards;
      columns.push(lane);
    });
    data.lanes = columns;
    return data;
  }

  /**
   * If a tray card is moved this function patches the POs to the new sub status
   * within Inshape
   * @return {Object} POs to be moved to new status
   */
  formatPoPatch() {
    let totalPoList = this.props.pos;
    let sourceLane = this.state.sourceLaneId;
    let cardTotal = this.state.cardId;
    let cardList= cardTotal.split(":");
    let card = cardList[0];
    let trayId = cardList[1];
    let targetLane = this.state.targetLaneId;
    let poPatchList = [];
    totalPoList.forEach((po) => {
      let poSubStatusId = po.subStatusId.toString();
      let poMaterialId = po.materialId.toString();
      let poProductionTrayId = po.productionTrayId.toString();
      if (trayId === 'noTray'){
        if (poSubStatusId === sourceLane && poMaterialId === card) {
          let patchPo = {};
          patchPo.productionOrderId = po.productionOrderId;
          patchPo.productionProcessStepId = targetLane;
          poPatchList.push(patchPo);
        }
      } else {
       if (poSubStatusId === sourceLane && poMaterialId === card && trayId === poProductionTrayId) {
         let patchPo = {};
         patchPo.productionOrderId = po.productionOrderId;
         patchPo.productionProcessStepId = targetLane;
         poPatchList.push(patchPo);
       }
      }
    });
    console.log(poPatchList);
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
    /** @TODO Check to see if black and don't allow into polishers */
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
        if (targetLaneId === '371' || targetLaneId === '373') {
          this.assignJarColor();
        }
        // this.props.patchPos(formatPoPatch);
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
          customCardLayout
          data={processes}
          eventBusHandle={this.setEventBus}
          draggable
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          onCardClick={onCardClick}
        >
          <PolishingCard
            timer={this.polishingTimer()}
            wsfpTimer={this.wsfpPolishingTimer()}
            premiumTimer={this.premiumPolishingTimer()}
            doneCards={this.state.doneCards}
            jarColor={this.renderJarColor()}
          />
        </Board>
      </div>
    );
  }
}

export default PolishingBoard;

import React, { Component } from 'react';
import { Board } from 'react-trello';
import CardModal from './CardModal';

/** @TODO Organize Tray Cards by machine type */

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
}

import React, { Component } from 'react';
import { InshapeAPI } from './Utils';
import Manufacturers from './components/Manufacturers';
import Navbarz from './components/Navbarz';
import SubTableBody from './components/SubTableBody';
import LoadingScreen from './components/LoadingScreen';
import CountdownTimer from './components/RefreshTimer';

/**
 * Main Application Class that holds all major functions and InshapeAPI calls
 * @param {Bool}   authorized        The application authorized status with InshapeAPI
 * @param {List}   allManufacturers  All Manufacturers gathered from InshapeAPI
 * @param {String} manufacturer      Name of the manufacturer selected
 * @param {String} manufacturerId    Identify each manufacturer given by InshapeAPI
 * @param {List}   processes         All subprocesses the manufacturer has defined in Inshape
 * @param {List}   pos               All Pos within the selected subprocess
 * @param {Sting}  patchResult       The InshapeAPI patch request
 * @param {Bool}   loadingDone       The status of the loading when calling the
 *  POs from the manufacturer
 * @param {Bool}   refreshSignal     Used to trigger the refresh of the production table
 * @type {Class}
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.handleToolChange = this.handleToolChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.fetchProductionOrders = this.fetchProductionOrders.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.setProcessName = this.setProcessName.bind(this);
    this.patchPos = this.patchPos.bind(this);
    this.triggerRefresh = this.triggerRefresh.bind(this);
    this.resetRefreshSignal = this.resetRefreshSignal.bind(this);
    this.refreshTimer = this.refreshTimer.bind(this);
    this.state = {
      authorized: null,
      allManufacturers: [],
      manufacturer: '',
      manufacturerId: null,
      processes: [],
      process: null,
      pos: null,
      patchResult: '',
      loadingDone: false,
      refreshSignal: false,
      inshapeTools: ['Overview', 'Polishing'],
      currentTool: null
    };
  }

  /** @TODO: Add a "draggable" prop to make sure the table is locked when updating. */
  /** @TODO Add a Refresh Date.now when the production table is rendered. */


  /**
   * Gathers the list of manufactures from the inshape API
   */
  componentDidMount() {
    InshapeAPI('get', 'https://api.shapeways.com/manufacturers/v1')
    .then((response) => {
      this.setState({
        allManufacturers: response.manufacturers,
        authorized: true
      });
    })
    .catch((err) => err);
  }

  /**
   * Gathers the Substatus within the "In Production" status per manufacturer
   */
  fetchStatuses() {
    const id = this.state.manufacturerId;
    const manufacturerUrl = `https://api.shapeways.com/manufacturers/${id}/v1`;
    InshapeAPI('get', manufacturerUrl)
    .then((response) => {
      this.setState({
        processes: response.productionProcesses
      }, this.defaultCheck);
    })
    .catch((err) => err);
  }

 /**
  * Changes the state when a manufacturer is selected
  * @param  {String} manName Name of the manufacturer selected
  * @param  {String} manId   Identify each manufacturer given by InshapeAPI
  */
  handleManufacturerChange(manName, manId) {
    this.setState(
      {
        manufacturer: manName,
        manufacturerId: manId
      },
      this.fetchStatuses
    );
  }

  /**
   * Sets the processes name
   * @param {String} target Selection of a process
   */
  setProcessName(target) {
    this.state.processes.forEach((list) => {
      if (list.name === target.name) {
        this.setState({
          process: list
        }, this.fetchProductionOrders);
      }
    }, this);
  }

/**
 * When the manufacturer and process are selected, this function gets all of the
 * POs for that spacific manufacturer in the "In Production" status
 */
  fetchProductionOrders() {
    const id = this.state.manufacturerId;
    const process = this.state.process;
    const processSteps = process.processSteps;
    const subStatusIds = [];
    processSteps.forEach((list) => {
      subStatusIds.push(list.id);
    });
    const IdsString = subStatusIds.toString();
    const poURL = `https://api.shapeways.com/production_orders/v1?manufacturer=${id}&subStatus=${IdsString}`;
    InshapeAPI('get', poURL)
    .then((response) => {
      const manufacturersPos = response.productionOrders;
      return manufacturersPos;
    })
    .then((manufacturersPos) => {
      this.setState({ pos: manufacturersPos }, this.handleLoading);
    })
    .catch((err) => err);
  }

  /**
   * If the manufacturer only has one process this function checks that and sets
   * it to 'default' if there is only one.
   */
  defaultCheck() {
    const currentProcesses = this.state.processes;
    const defaultName = { name: 'default' };
    if (currentProcesses.length === 1) {
      this.setProcessName(defaultName);
    }
  }

  /**
   * This function handles the process change when a process is selected
   * @param  {String} target Selection of a process
   */
  handleProcessChange(target) {
    this.setProcessName(target);
  }

  /**
   * If a move is made this fuctions sends a patch request with the updated statuses
   * @param  {Object} poPatchList The list of POs to be updated with a new status
   */
  patchPos(poPatchList) {
    const patchPoURL = 'https://api.shapeways.com/production_orders/v1';
    const jsonPoList = JSON.stringify(poPatchList);
    this.setState({ patchResult: 'loading' });
    InshapeAPI('patch', patchPoURL, jsonPoList)
    .then((response) => {
      this.setState({
        patchResult: response.result
      }, this.fetchProductionOrders);
      if (response.result !== '') {
        this.setStateWithTimeout('patchResult', '', 3000);
      }
    })
    .catch((err) => err);
  }

  /**
   * User feedback alart with timer
   * @param {String} key    Index value
   * @param {String} value  Next value
   * @param {Number} time   Time delay in mili seconds
   */
  setStateWithTimeout(key, value, time) {
    return setTimeout(function() {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
    }.bind(this), time);
  }

  /**
   * Handles the loading time for the POs
   */
  handleLoading() {
    const pos = this.state.pos;
    if (pos !== null) {
      this.setState({ loadingDone: true }, this.loadingPos);
    }
  }

  /**
   * Handles the state change when the refresh button is clicked or the refresh
   * button is pressed or if the refresh timer runs out
  */
  triggerRefresh() {
    this.setState({
      refreshSignal: true,
      patchResult: 'loading'
    }, this.fetchProductionOrders);
  }

/**
 * Resets the refreshSignal after the refresh is complete
 */
  resetRefreshSignal() {
    this.setState({
      refreshSignal: false,
      patchResult: ''
    });
  }

  /**
   * Renders the timer on the page sending to the timer componet
   * @return {HTML} Renders the count down timer for the refresh action
   */
  refreshTimer() {
    return (
      <CountdownTimer
        secondsRemaining="120"
        refresh={this.triggerRefresh}
      />
    );
  }

  handleToolChange(tool) {
    this.setState({
      currentTool: tool
    });
  }

  /**
   * Renders a loading screen or the board depending if the Pos have loaded
   * @return {HTML} Renders a loading screen if there are no POs and renders the
   * the production board if there are
   */
  mainView() {
    const manufacturer = this.state.manufacturer;
    const manList = this.state.allManufacturers;
    const processes = this.state.processes;
    const inshapeTools = this.state.inshapeTools;
    const currentProcess = this.state.process;
    const currentTool = this.state.currentTool;
    const loadingDone = this.state.loadingDone;
    const pos = this.state.pos;
    const refreshSignal = this.state.refreshSignal;
    if (currentProcess !== null && currentTool !== null) {
      if (loadingDone) {
        return (
          <SubTableBody
            refreshSignal={refreshSignal}
            resetRefresh={this.resetRefreshSignal}
            list={currentProcess}
            pos={pos}
            patchPos={this.patchPos}
          />
        );
      } else {
        return (
          <LoadingScreen />
        );
      }
    } else {
      return (
        <Manufacturers
          list={manList}
          manufacturer={manufacturer}
          toolList={inshapeTools}
          onToolChange={this.handleToolChange}
          onManufacturerChange={this.handleManufacturerChange}
          processes={processes}
          onProcessChange={this.handleProcessChange}
        />
      );
    }
  }

  /**
   * Renders the entire application to the window
   * @return {HTML} render of component
   */
  /** @TODO Add a condition with the currentProcess to also chek the current
   * Tool selected */
  render() {
    const manufacturer = this.state.manufacturer;
    const currentProcess = this.state.process;
    const result = this.state.patchResult;
    const authorized = this.state.authorized;
    return (
      <div>
        <Navbarz
          refreshTimer={this.refreshTimer()}
          refresh={this.triggerRefresh}
          manufacturer={manufacturer}
          process={currentProcess}
          result={result}
          authorized={authorized}
        />
        {this.mainView()}
      </div>
    );
  }
}

export default App;

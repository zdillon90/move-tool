import React, { Component } from 'react';
import { InshapeAPI } from './Utils';
import Manufacturers from './components/Manufacturers';
import Navbarz from './components/Navbarz';
import SubTableBody from './components/SubTableBody';

// Main Application Class that holds all major functions
class App extends Component {
  constructor(props) {
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.fetchProductionOrders = this.fetchProductionOrders.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.setProcessName = this.setProcessName.bind(this);
    this.patchPos = this.patchPos.bind(this);
    this.state = {
      authorized: null,
      authLink: null,
      allManufacturers: [],
      manufacturer: '',
      manufacturerId: null,
      processes: [],
      process: null,
      pos: null,
      patchResult: '',
      loadingDone: false
    };
  }

// Gathers the list of manufactures from the inshape API
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

  // Gathers the Substatus within the "In Production" status per manufacturer
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

 // Changes the state when a manufacturer is selected
  handleManufacturerChange(manName, manId) {
    this.setState(
      {
        manufacturer: manName,
        manufacturerId: manId
      },
      this.fetchStatuses
    );
  }

  // Sets the processes name
  setProcessName(target) {
    this.state.processes.forEach((list) => {
      if (list.name === target.name) {
        this.setState({
          process: list
        }, this.fetchProductionOrders);
      }
    }, this);
  }

  // When the manufacturer and process are selected, this function gets all of
  // the POs for that spacific manufacturer in the "In Production" status
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
      throw manufacturersPos;
    })
    .catch((err) => err);
  }

  // If the manufacturer only has one process this function checks that and sets
  // it to 'default' if there is only one.
  defaultCheck() {
    const currentProcesses = this.state.processes;
    const defaultName = { name: 'default' };
    if (currentProcesses.length === 1) {
      this.setProcessName(defaultName);
    }
  }

  // This function handles the process change when a process is selected
  handleProcessChange(target) {
    this.setProcessName(target);
  }

  // If a move is made this fuctions sends a patch request with the updated
  // statuses
  patchPos(poPatchList) {
    const patchPoURL = 'https://api.shapeways.com/production_orders/v1';
    const jsonPoList = JSON.stringify(poPatchList);
    this.setState({ patchResult: 'loading' });
    InshapeAPI('patch', patchPoURL, jsonPoList)
    .then((response) => {
      this.setState({
        patchResult: response.result
      }, this.defaultCheck);
      if (response.result !== '') {
        this.setStateWithTimeout('patchResult', '', 3000);
      }
    })
    .catch((err) => err);
  }

  // User feedback alart with timmer
  setStateWithTimeout(key, value, time) {
    return setTimeout(function() {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
    }.bind(this), time);
  }

  // Handles the loading time for the POs
  handleLoading() {
    const pos = this.state.pos;
    if (pos !== null) {
      this.setState({ loadingDone: true }, this.loadingPos);
    }
  }

  rerenderData() {
    // Place holder for rerendering function
  }

  // TODO Add in proper Loading screen

  // Renders a loading screen or the board depending if the Pos have loaded
  loadingPos() {
    const currentProcess = this.state.process;
    const loadingDone = this.state.loadingDone;
    const pos = this.state.pos;
    if (loadingDone) {
      return (
        <SubTableBody
          list={currentProcess}
          pos={pos}
          patchPos={this.patchPos}
        />
      );
    } else {
      return (
        <h1>Loading...</h1>
      );
    }
  }

  // Renders the entire application to the window
  render() {
    const manList = this.state.allManufacturers;
    const manufacturer = this.state.manufacturer;
    const processes = this.state.processes;
    const currentProcess = this.state.process;
    const result = this.state.patchResult;
    const authLink = this.state.authLink;
    const authorized = this.state.authorized;
    return (
      <div>
        <Navbarz
          refresh={this.fetchProductionOrders}
          manufacturer={manufacturer}
          process={currentProcess}
          result={result}
          authorized={authorized}
        />
        {currentProcess ? (
          this.loadingPos()
        ) : (
          <Manufacturers
            list={manList}
            onManufacturerChange={this.handleManufacturerChange}
            processes={processes}
            onProcessChange={this.handleProcessChange}
            authLink={authLink}
          />
        )}
      </div>
    );
  }
}

export default App;

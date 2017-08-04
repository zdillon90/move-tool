import React, { Component } from 'react';
import { InshapeAPI } from './Utils';
import Manufacturers from './components/Manufacturers';
import Navbarz from './components/Navbarz';
import SubTableBody from './components/SubTableBody';

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
      patchResult: ''
    };
  }

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

  handleManufacturerChange(manName, manId) {
    this.setState(
      {
        manufacturer: manName,
        manufacturerId: manId
      },
      this.fetchStatuses
    );
  }

  setProcessName(target) {
    this.state.processes.forEach((list) => {
      if (list.name === target.name) {
        this.setState({
          process: list
        }, this.fetchProductionOrders);
      }
    }, this);
  }

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
      this.setState({ pos: response.productionOrders });
    })
    .catch((err) => err);
  }


  defaultCheck() {
    const currentProcesses = this.state.processes;
    const defaultName = { name: 'default' };
    if (currentProcesses.length === 1) {
      this.setProcessName(defaultName);
    }
  }

  handleProcessChange(target) {
    this.setProcessName(target);
  }

  patchPos(poPatchList) {
    // fetch('/update_production_orders', {
    //   method: 'PATCH',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(poPatchList)
    // })
    // .then ( response => response.json() )
    // .then(function(jsonResponse) {
    //   this.setState({patchResult: jsonResponse.result}, this.defaultCheck);
    //
    //   // If we have an error to display, reset after 3 seconds
    //   if (jsonResponse.result !== '') {
    //     this.setStateWithTimeout('patchResult', '', 3000);
    //   }
    // }.bind(this));
    const patchPoURL = 'https://api.shapeways.com/production_orders/v1'
    const jsonPoList = JSON.stringify(poPatchList)
    InshapeAPI('patch', patchPoURL, jsonPoList)
    .then(function(response) {
      this.setState({
        patchResult: response.result
      }, this.defaultCheck);
      if (response.result !== '') {
        this.setStateWithTimeout('patchResult', '', 3000);
      }
    }.bind(this))
    .catch((err) => err);
  }

  setStateWithTimeout(key, value, time) {
    return setTimeout(function() {
      const newState = {};
      newState[key] = value;
      this.setState(newState);
    }.bind(this), time);
  }

  // TODO Add in proper Loading screen
  loadingPos() {
    const currentProcess = this.state.process;
    const pos = this.state.pos;
    if (pos) {
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

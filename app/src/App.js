import React, { Component } from 'react';
import { InshapeAPI } from './Utils';
import storage from 'electron-json-storage';
import axios from 'axios';
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
    // const tokenPromise = new Promise((resolve, reject) => {
    //   storage.has('accessToken', (error, hasKey) => {
    //     if (hasKey) {
    //       resolve('Stuff worked! There is a key!');
    //     } else {
    //       reject(Error(`It broke: ${error}`));
    //     }
    //   });
    // });
    // tokenPromise.then((result) => {

    // storage.get('accessToken', (error, data) => {
    //   if (error) {
    //     throw error;
    //   }
    //   console.log(data);
    //   const req = { method: 'get',
    //     url: 'https://api.shapeways.com/manufacturers/v1',
    //     headers:
    //     { authorization: `bearer ${data}` }
    //   };
    //   axios(req)
    //   .then((response) => {
    //     console.log(response);
    //     if (response.status === 200) {
    //       this.setState({ authorized: true });
    //     }
    //     return response.data;
    //   })
    //   .then(({ manufacturers: allManufacturers }) => this.setState({ allManufacturers }))
    //   .catch((err) => console.log(err));
    // });

      // return result;
    // }).catch((promError) => console.log(promError));

    InshapeAPI('get', 'https://api.shapeways.com/manufacturers/v1')
    .then((response) => {
      console.log('made it back');
      console.log(response);
      this.setState({ allManufacturers: response.manufacturers });
    })
    // .then(({ manufacturers: allManufacturers }) => this.setState({ allManufacturers }))
    // Add a then here to set manufacturers...?
    .catch((err) => err);
  }

  fetchStatuses() {
    const id = this.state.manufacturerId;
    const manufacturerUrl = `/manufacturer/${id}`;
    fetch(manufacturerUrl)
      .then(response => response.json())
      .then( ({productionProcesses: processes}) =>
        this.setState({processes}, this.defaultCheck));
  }

  handleManufacturerChange(man_name, man_id) {
    this.setState(
      {
        manufacturer: man_name,
        manufacturerId: man_id
      },
      this.fetchStatuses
    );
  }

  setProcessName(target) {
    this.state.processes.forEach(function(list) {
      if (list.name === target.name) {
        this.setState({
          process: list
        }, this.fetchProductionOrders);
      }
    }, this);
  }

  fetchProductionOrders() {
    let id = this.state.manufacturerId;
    let process = this.state.process;
    let processSteps = process.processSteps;
    let subStatusIds = []
    processSteps.forEach(function(list) {
      subStatusIds.push(list.id);
    });
    let IdsString = subStatusIds.toString();
    const poURL = '/production_orders/manufacturer=' + id + '/sub_statuses=' + IdsString;
    fetch(poURL)
      .then ( response => response.json() )
      .then ( ({productionOrders: pos}) =>
        this.setState({pos}));
  }


  defaultCheck() {
    let currentProcesses = this.state.processes
    const defaultName = {name: "default"}
    if (currentProcesses.length === 1) {
      this.setProcessName(defaultName);
    }
  }

  handleProcessChange(target) {
    this.setProcessName(target);
  }

  patchPos(poPatchList) {
    fetch('/update_production_orders', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poPatchList)
    })
    .then ( response => response.json() )
    .then(function(jsonResponse) {
      this.setState({patchResult: jsonResponse.result}, this.defaultCheck);

      // If we have an error to display, reset after 3 seconds
      if (jsonResponse.result !== "") {
        this.setStateWithTimeout('patchResult', '', 3000);
      }
    }.bind(this))

  }

  setStateWithTimeout(key, value, time) {
    return setTimeout(function() {
        var newState = {};
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

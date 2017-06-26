import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'
import SubTableBody from './components/SubTableBody'

class App extends Component {
  constructor(props){
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.fetchProductionOrders = this.fetchProductionOrders.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.setProcessName = this.setProcessName.bind(this);
    this.patchPos = this.patchPos.bind(this);
    this.state = {
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
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: allManufacturers}) => this.setState({allManufacturers}));
  }

  fetchStatuses() {
    let id = this.state.manufacturerId;
    const manufacturerUrl  = '/manufacturer/' + id;
    fetch(manufacturerUrl)
      .then( responce => responce.json() )
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
      .then ( responce => responce.json() )
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
    .then ( responce => responce.json() )
    .then( ({result: patchResult}) =>
      this.setState({patchResult}, this.defaultCheck));
  }

  // TODO Add in proper Loading screen
  loadingPos() {
    let currentProcess = this.state.process;
    let pos = this.state.pos;
    if (pos) {
      return(
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
    let manList = this.state.allManufacturers;
    let manufacturer = this.state.manufacturer;
    let processes = this.state.processes;
    let currentProcess = this.state.process;
    let result = this.state.patchResult;
    return (
      <div>
        <Navbarz
          manufacturer={manufacturer}
          process={currentProcess}
          result={result}
        />
        {currentProcess ? (
          this.loadingPos()
        ) : (
          <Manufacturers
            list={manList}
            onManufacturerChange={this.handleManufacturerChange}
            processes={processes}
            onProcessChange={this.handleProcessChange}
          />
        )}
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'
import SubTable from './components/SubTable'

class App extends Component {
  constructor(props){
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.setProcessName = this.setProcessName.bind(this);
    this.state = {
      allManufacturers: [],
      manufacturer: '',
      manufacturerId: null,
      processes: [],
      process: null,
      // processName: '',
      // subProcessList: []
    };
  }

  componentDidMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: allManufacturers}) => this.setState({allManufacturers}));
  }

  fetchStatuses() {
    var id = this.state.manufacturerId;
    var manufacturerUrl  = '/manufacturer/' + id;
    fetch(manufacturerUrl)
      .then( responce => responce.json() )
      .then( ({productionProcesses: processes} ) =>
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
        });
      }
    }, this);
  }

  defaultCheck() {
    let currentProcesses = this.state.processes
    const defaultName = {name: "default"}
    if (currentProcesses.length === 1) {
      // this.setState({processName: 'default'});
      this.setProcessName(defaultName);
    }
  }

  handleProcessChange(target) {
    this.setProcessName(target);
  }

  render() {
    let manList = this.state.allManufacturers;
    let manufacturer = this.state.manufacturer;
    let processes = this.state.processes;
    let currentProcess = this.state.process;
    return (
      <div>
        <Navbarz manufacturer={manufacturer} />
        {currentProcess ? (
          <SubTable list={currentProcess} />
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

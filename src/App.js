import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'
// import SubTable from './components/SubTable'

class App extends Component {
  constructor(props){
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.state = {
      allManufacturers: [],
      manufacturer: '',
      manufacturer_id: 0,
      processes: [],
      process: ''
    };
  }

  componentDidMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: allManufacturers}) => this.setState({allManufacturers}));
  }

  fetchStatuses() {
    var id = this.state.manufacturer_id;
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
        manufacturer_id: man_id
      },
      this.fetchStatuses
    );
  }

  defaultCheck() {
    const currentProcesses = this.state.processes
    if (currentProcesses.length === 1) {
      this.setState({process: 'default'});
    }
  }

  handleProcessChange(pros_name) {
    this.setState({process: pros_name});
  }

  render() {
    let manList = this.state.allManufacturers;
    let manufacturer = this.state.manufacturer;
    let processes = this.state.processes;
    let currentProcess = this.state.process;
    return (
      <div>
        <Navbarz manufacturer={manufacturer} />
        {currentProcess === '' ? (
          <Manufacturers
            list={manList}
            onManufacturerChange={this.handleManufacturerChange}
            processes={processes}
            onProcessChange={this.handleProcessChange}
          />
        ) : (
          <h1>SupTable placeholder</h1>
        )}
      </div>
    );
  }
}

export default App;

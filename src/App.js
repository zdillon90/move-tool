import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import ManufacturersDrop from './components/ManufacturersDrop'
import Navbarz from './components/Navbarz'

class App extends Component {
  constructor(props){
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.state = {
      items: [],
      manufacturer: '',
      manufacturer_id: null,
      processes: []
    };
  }

  componentDidMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: items}) => this.setState({items}));
  }

  fetchStatuses(man_id) {
    var id = man_id;
    fetch('/manufacturer/${id}')
      .then( responce => responce.json() )
      .then( ({productionProcesses: processes}) => this.setState({processes}));
  }

  handleManufacturerChange(man_name, man_id) {
    this.setState({
      manufacturer: man_name,
      manufacturer_id: man_id
    });
  }

  render() {
    const manList = this.state.items;
    const manufacturer = this.state.manufacturer;
    return (
      <div>
        <Navbarz manufacturer={manufacturer} />
        <Manufacturers
          list={manList}
          onManufacturerChange={this.handleManufacturerChange}
        />
      </div>
    );
  }
}

export default App;

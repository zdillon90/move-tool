import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'

class App extends Component {
  constructor(props){
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.state = {
      items: [],
      manufacturer: '',
      manufacturer_id: null,
    };
  }

  componentWillMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: items}) => this.setState({items}));
  }

  handleManufacturerChange(manufacturer_name) {
    this.setState({
      manufacturer: manufacturer_name
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

import React, { Component } from 'react';
import Manufacturers from './components/Manufacturers'
import Navbarz from './components/Navbarz'

class App extends Component {
  constructor(props){
    super(props);
    this.onManufacturerClick = this.onManufacturerClick.bind(this);
    this.state = {
      items: [],
      manufacturer: [],
      manufacturer_id: null,
      manufacturer_name: "Manufacturer"
    };
  }

  componentDidMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: items}) => this.setState({items}));
  }

  onManufacturerClick(event) {
    this.setState({
      manufacturer_id: event.target.value,
      manufacturer_name: event.target.name
    });
  }

  render() {
    var manList = this.state.items;
    return (
      <div>
        <Navbarz manufacturer={this.state.manufacturer} />
        <Manufacturers
          list={manList}
          manufacturer={this.state.manufacturer_name}
          clickfunction={this.onManufacturerClick}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

 // This class renders the Manufacturers in a dropdown menu
class ManufacturersDrop extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  // Toggels the state of the dropdown closed or open
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

// Handles the action if a manufacturer is clicked
  handleChange (event) {
    this.props.onManufacturerChange(
      event.target.name,
      event.target.value
    );
  }

  // Renders the dropdown menu
  render() {
    const items = this.props.list;
    let header = null;
    if (items.length > 1) {
      header = <DropdownItem header>Choose One</DropdownItem>;
    } else {
      header = <DropdownItem header>Loading...</DropdownItem>;
    }
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Manufacturers
        </DropdownToggle>
        <DropdownMenu>
          {header}
          {items.map(item =>
            <DropdownItem
              key={item.id}
              value={item.id}
              name={item.name}
              onClick={this.handleChange}>
                {item.name}
            </DropdownItem>
            , this)
          }
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default ManufacturersDrop;

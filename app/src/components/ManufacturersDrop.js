import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

class ManufacturersDrop extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange (event) {
    this.props.onManufacturerChange(
      event.target.name,
      event.target.value
    );
  }

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

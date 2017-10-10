import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

 /**
  * This class renders the Manufacturers in a dropdown menu
  * @param {Bool} dropdownOpen Handles the state of the dropdown manufacturer
  * menu
  * @type {Class}
  */
class ManufacturersDrop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  /**
   * Toggles the state of the dropdown closed or open
   */
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

/**
 * Handles the action if a manufacturer is clicked
 * @param  {String} event Click event when a manufacturer is selected
 */
  handleChange (event) {
    this.props.onManufacturerChange(
      event.target.name,
      event.target.value
    );
  }

  /**
   * Renders the manufacturer dropdown menu
   * @return {HTML} Depending on the state of the Manufacturers will populate
   * the dropdown with a clickable list of manufactures.
   */
  render() {
    const items = this.props.list;
    const manufacturer = this.props.manufacturer;
    let header = null;
    if (items.length > 1) {
      header = <DropdownItem header>Choose One</DropdownItem>;
    } else {
      header = <DropdownItem header>Loading...</DropdownItem>;
    }
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {manufacturer}
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

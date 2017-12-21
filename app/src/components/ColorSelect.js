import React, { Component } from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

/**
 * This component is the gives the ability to select color from an
 * array of available colors jar of WSFP within the polisher.
 */
class ColorSelect extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  /**
   * Toggles the dropdown to be open or closed
   */
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange(event) {
    this.props.onColorChange(
      event.target.name
    );
  }

  render() {
    const colors = this.props.colorList;
    const currentJarColor = this.props.currentJarColor;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret size="sm"
          style={{
                  color: currentJarColor,
                  fontWeight: 'bold'
                }}>
          {currentJarColor}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header>Jar Color:</DropdownItem>
          {colors.map(color =>
            <DropdownItem
              key={color.id}
              name={color.color}
              onClick={this.handleChange}>
              {color.color}
            </DropdownItem>
            , this)
          }
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default ColorSelect;

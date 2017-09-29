import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

/**
 * If the manufacturer has more than one process then this dropdown apears with
 * a list of the manufacturers process flows
 * @param {Bool} dropdownOpen If true shows the process dropdown menu
 * @type {Class}
 */
class ProcessDrop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  /**
   * Toggles the menu to be open or closed
   */
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  /**
   * Take care of the selection of a process
   * @param  {String} event clicked process
   */
  handleChange(event) {
    this.props.onProcessChange(event.target)
  }

  /**
   * Renders out the process dropdown onto the page
   * @return {HTML} render of component
   */
  render() {
    let items = this.props.processlist
    return (
      <div>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Process
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Choose One</DropdownItem>
            {items.map(item =>
              <DropdownItem
                key={item.production_process_id}
                name={item.name}
                onClick={this.handleChange}>
                  {item.name}
              </DropdownItem>
              , this)
            }
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

export default ProcessDrop;

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class ProcessDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    <div>
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Manufacturers
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Choose One</DropdownItem>
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
    </div>
  }
}

export default ProcessDrop;

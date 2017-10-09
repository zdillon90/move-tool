import React, { Component } from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class ToolSelect extends Component {
  constructor(props) {
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

  // handleChange (event) {
  //   this.props.onToolSelect(
  //     event.target.name,
  //     event.target.value
  //   );
  // }

  render() {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Tool Select
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Choose One</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

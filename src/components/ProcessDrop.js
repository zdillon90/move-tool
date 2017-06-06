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
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    }
  }

  // TODO When process is selected, update state
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange(event) {
    console.log(event.target);
    this.props.onProcessChange(event.target)
  }

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

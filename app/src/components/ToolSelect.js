import React, { Component } from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

/**
 * This component is the gives the ability to select tools from an
 * array of available tools for a specific manufacturer
 */
class ToolSelect extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  /**
   *
   */
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange(event) {
    this.props.onToolChange(
      event.target.name
    );
  }

  render() {
    const tools = this.props.toolList;
    const currentTool = this.props.currentTool;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {currentTool}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Choose One</DropdownItem>
          {tools.map(tool =>
            <DropdownItem
              key={tool.id}
              name={tool.name}
              onClick={this.handleChange}>
              {tool.name}
            </DropdownItem>
            , this)
          }
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default ToolSelect;

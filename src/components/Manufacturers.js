import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
 } from 'reactstrap';

class Manufacturers extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.state = {items: []}
  }
  componentWillMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: items}) => this.setState({items}))
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  render() {
    let items = this.state.items
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">Tray Move</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Authorize</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://inshape.shapeways.com">Inshape</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Manufacturer
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Choose One</DropdownItem>
            {items.map(item =>
              <DropdownItem key={item.id}>{item.name}</DropdownItem>)}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }
}

export default Manufacturers

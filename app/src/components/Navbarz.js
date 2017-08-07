import React, { Component } from 'react';
import { shell } from 'electron';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import MoveAlert from './MoveAlert';

// TODO Add a refreash button
class Navbarz extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleInshapeClick() {
    shell.openExternal('https://inshape.shapeways.com/');
  }
  render() {
    const manufacturer = this.props.manufacturer;
    const process = this.props.process;
    const result = this.props.result;
    const authorized = this.props.authorized
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="">Inshape Movement Tool</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.handleInshapeClick}>Inshape</NavLink>
              </NavItem>
              <NavItem>
                {authorized ? (
                  <NavLink disabled >Authorized</NavLink>
                ) : (
                  <NavLink disabled >Unauthorized</NavLink>
                )}
              </NavItem>
              <NavItem>
                {process ? (
                  <NavLink disabled >
                    Manufacturer: {manufacturer} - {process.display_name}
                  </NavLink>
                ) : (
                  <NavLink></NavLink>
                )}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <MoveAlert result={result} />
      </div>
    );
  }
}

export default Navbarz;
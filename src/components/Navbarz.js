import React, { Component } from 'react';
import MoveAlert from './MoveAlert';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

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
  handleCLick() {
    window.location.assign();
  }
  render() {
    let manufacturer = this.props.manufacturer;
    let process = this.props.process;
    let result = this.props.result;
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">Move Tool</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.handleCLick}>Authorize</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://inshape.shapeways.com">Inshape</NavLink>
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

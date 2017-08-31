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


// This class holds the Navigation bar components
class Navbarz extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  // Toggels the Navbar actions if if the screen can't hold all the actions next
  // to each other
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  // If opens a new Inshape page on the default browser
  handleInshapeClick() {
    shell.openExternal('https://inshape.shapeways.com/');
  }

  handleRefreshTimer() {
    // Take care of the action of timmer here
    // run this.props.refresh
  }

  // Renders the Navbar to the window
  render() {
    const manufacturer = this.props.manufacturer;
    const process = this.props.process;
    const result = this.props.result;
    const authorized = this.props.authorized;
    const refreshButton = this.props.refresh;
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="">Inshape Movement Tool</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {process ? (
                <NavItem>
                  <NavLink onClick={refreshButton}>Refresh({this.props.refreshTimer})</NavLink>
                </NavItem>
              ) : (
                <NavLink></NavLink>
              )}
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

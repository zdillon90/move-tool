import React, { Component } from 'react';
import electron from 'electron';
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


/**
 * This class holds the Navigation bar components
 * @param {Boolean} isOpen If the full menu bar can't fit on the screen then it
 * formats those options into a dropdown menu
 * @type {Class}
 */
class Navbarz extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  /**
   * Toggels the Navbar actions if if the screen can't hold all the actions next
   * to each other
   */
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  /**
   * If opens a new Inshape page on the default browser
   */
  static handleInshapeClick() {
    electron.shell.openExternal('https://inshape.shapeways.com/');
  }

  /**
   * Renders the Navbar to the window. This includes the home button that will
   * take the user back to the start screen, The refresh button and timer for
   * refreshing the table's data, an external Inshape link, and
   * manufacturer-process info
   * @return {HTML} render of component
   */
  render() {
    const manufacturer = this.props.manufacturer;
    const process = this.props.process;
    const result = this.props.result;
    const authorized = this.props.authorized;
    const refreshButton = this.props.refresh;
    const refreshTime = this.props.refreshTimer;
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="">Inshape Move Tool</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {process ? (
                <NavItem>
                  <NavLink onClick={refreshButton}>Refresh({refreshTime})</NavLink>
                </NavItem>
              ) : (
                <NavLink></NavLink>
              )}
              <NavItem>
                <NavLink onClick={Navbarz.handleInshapeClick}>Inshape</NavLink>
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

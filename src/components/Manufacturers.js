import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
  Jumbotron,
 } from 'reactstrap';

class Manufacturers extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this);
    // this.onManufacturerClick = this.onManufacturerClick.bind(this);
    this.state = {
      dropdownOpen: false,
      items: []
      // manufacturer_id: null,
      // manufacturer_name: "Manufacturer"
    };
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  clicked () {
    this.props.clickfunction(this.props.event)
  }

  // onManufacturerClick(event) {
  //   this.setState({
  //     manufacturer_id: event.target.value,
  //     manufacturer_name: event.target.name
  //   });
  // }
  render() {
    let items = this.props.list
    return (
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Welcome to The Future!</h1>
                <h4>Choose a Manufacturer:</h4>
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle caret>
                    {this.props.manufacturer}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Choose One</DropdownItem>
                    {items.map(item =>
                      <DropdownItem
                        key={item.id}
                        value={item.id}
                        name={item.name}
                        onClick={this.clicked}>
                          {item.name}
                      </DropdownItem>
                      , this)
                    }
                  </DropdownMenu>
                </ButtonDropdown>
                <p>Selected: {this.state.manufacturer_id}</p>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Manufacturers

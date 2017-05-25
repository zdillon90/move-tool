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
    this.onManufacturerClick = this.onManufacturerClick.bind(this);
    this.state = {
      dropdownOpen: false,
      items: [],
      manufacturer_id: null,
      manufacturer_name: "Manufacturer"
    };
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
  onManufacturerClick(event) {
    this.setState({
      manufacturer_id: event.target.value,
      manufacturer_name: event.target.name
    });
  }
  render() {
    let items = this.state.items
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
                    {this.state.manufacturer_name}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Choose One</DropdownItem>
                    {items.map(item =>
                      <DropdownItem
                        key={item.id}
                        value={item.id}
                        name={item.name}
                        onClick={this.onManufacturerClick}>
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

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
  onManufacturerClick(mSelected) {
    this.setState({ mSelected });
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
                    Manufacturer
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Choose One</DropdownItem>
                    {items.map(item =>
                      <DropdownItem
                        key={item.id}
                        value={item.id}
                        onClick={() => this.onManufacturerClick.bind(this, item.id)}>
                          {item.name}
                      </DropdownItem>
                      , this)
                    }
                  </DropdownMenu>
                </ButtonDropdown>
                <p>Selected: {this.state.onManufacturerClick}</p>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Manufacturers

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
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dropdownOpen: false,
      items: []
    };
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleChange (event) {
    this.props.onManufacturerChange(
      event.target.name,
      event.target.value
    );
  }

  render() {
    let items = this.props.list;
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
                    Manufacturers
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Choose One</DropdownItem>
                    {items.map(item =>
                      <DropdownItem
                        key={item.id}
                        value={item.id}
                        name={item.name}
                        onClick={this.handleChange}>
                          {item.name}
                      </DropdownItem>
                      , this)
                    }
                  </DropdownMenu>
                </ButtonDropdown>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Manufacturers

import React, { Component } from 'react';
import ManufacturersDrop from './ManufacturersDrop'
// import ProcessDrop from './ProcessDrop'
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
                <ManufacturersDrop
                  list={items}
                  onManufacturerChange={this.props.onManufacturerChange}
                />
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Manufacturers;

import React, { Component } from 'react';
import ManufacturersDrop from './ManufacturersDrop'
import ProcessDrop from './ProcessDrop'
// import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  Jumbotron,
  ButtonGroup,
 } from 'reactstrap';

class Manufacturers extends Component {
  render() {
    const manList = this.props.list;
    const processes = this.props.processes;
    return (
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Welcome to The Future!</h1>
                <h4>Choose a Manufacturer:</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <ButtonGroup>
                  <ManufacturersDrop
                    list={manList}
                    onManufacturerChange={this.props.onManufacturerChange}
                  />
                  {processes.length > 1 &&
                    <ProcessDrop
                      processlist={processes}
                      onProcessChange={this.props.onProcessChange}
                    />
                  }
                </ButtonGroup>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default Manufacturers;

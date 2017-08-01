import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Jumbotron,
  ButtonGroup,
 } from 'reactstrap';
import ManufacturersDrop from './ManufacturersDrop';
import ProcessDrop from './ProcessDrop';
// import Auth from './Auth';
// import PropTypes from 'prop-types';


class Manufacturers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultProceess: false
    };
  }

  render() {
    const manList = this.props.list;
    const processes = this.props.processes;
    // let authLink =  this.props.authLink;
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

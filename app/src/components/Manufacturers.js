import React, { Component } from 'react';
import ManufacturersDrop from './ManufacturersDrop';
import ProcessDrop from './ProcessDrop';
import Auth from './Auth';
// import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  Jumbotron,
  ButtonGroup,
 } from 'reactstrap';

class Manufacturers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultProceess: false
    }
  }



  render() {
    let manList = this.props.list;
    let processes = this.props.processes;
    let authLink =  this.props.authLink;
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
                  {authLink ? (
                    <Auth authLink={authLink}/>
                  ) : (
                    <ManufacturersDrop
                      list={manList}
                      onManufacturerChange={this.props.onManufacturerChange}
                    />
                  )}
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

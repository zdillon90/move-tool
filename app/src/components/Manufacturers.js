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

/**
 * This class is the container that holds the manufacturer and process dropdown
 * @param {Bool} defaultProceess If there is only one process to a specific
 * manufacturer it will not render the process dropdown.
 * @type {Class}
 */
class Manufacturers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultProceess: false
    };
  }

  /**
   * Renders the Manufacturers Page, a container to hold the manufacturer and
   * process dropdowns and some instructions, as well as a Shapeways logo
   * @return {HTML} render of component
   */
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
        <img className="pbmt-loading__image" src="https://imgur.com/BgyYIa0.png" alt="Shapeways" />
      </div>
    );
  }
}

export default Manufacturers;

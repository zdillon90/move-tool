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
import ToolSelect from './ToolSelect';

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
    const manufacturer = this.props.manufacturer
    const manList = this.props.list;
    const processes = this.props.processes;
    const toolList = this.props.toolList;
    const currentTool = this.props.currentTool;
    return (
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Welcome to The Future!</h1>
                <h4>Choose a Manufacturer and Tool:</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <ButtonGroup>
                  <ManufacturersDrop
                    manufacturer={manufacturer}
                    list={manList}
                    onManufacturerChange={this.props.onManufacturerChange}
                  />
                  {
                    processes.length > 1 &&
                    <ProcessDrop
                      processlist={processes}
                      onProcessChange={this.props.onProcessChange}
                    />
                  }
                  <ToolSelect
                    currentTool={currentTool}
                    toolList={toolList}
                    onToolChange={this.props.onToolChange}
                  />
                </ButtonGroup>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <img
          className="pbmt-welcome__image"
          src="https://static1.sw-cdn.net/files/cms/brand-resources/shapeways-logo-rgb-20141008.png"
          alt="Shapeways"
        />
      </div>
    );
  }
}

export default Manufacturers;

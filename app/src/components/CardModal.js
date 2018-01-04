import React, { Component } from 'react';
import PoModalList from './PoModalList';
import { Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

/**
 * This class renders out the modal when the card is clicked showing the list of Pos
 * @type {Class}
 */
class CardModal extends Component {

  /**
   * If the card is clicked on it will render a card modal that contains the list of POs
   * @return {HTML} render of the component
   */
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>{this.props.metadata.trayName}</ModalHeader>
          <ModalBody>
            Production Order list:
            <PoModalList metadata={this.props.metadata} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggle}>Close</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CardModal;

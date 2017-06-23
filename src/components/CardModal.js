import React, { Component } from 'react';
import PoModalList from './PoModalList';
import { Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

class CardModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Tray</ModalHeader>
          <ModalBody>
            Production Order list:
            <PoModalList poList={this.props.metadata} />
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

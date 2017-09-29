import React, { Component } from 'react';
// import { ListGroup, ListGroupItem } from 'reactstrap';

/**
 * This class creates the PO list for each card when it is clicked
 * @type {Class}
 */
class PoModalList extends Component {

  /**
   * Renders the list of POs within the card modal
   * @return {HTML} render of component
   */
  render() {
    let items = this.props.poList;
    return (
      <div>
        <ul>
          {items.map(item =>
            <li key={item.toString()}>{item}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default PoModalList;

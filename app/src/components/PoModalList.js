import React, {Component} from 'react';
// import { ListGroup, ListGroupItem } from 'reactstrap';

// This class creates the PO list for each card when it is clicked
class PoModalList extends Component {
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

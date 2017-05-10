import React, { Component } from 'react';

class Manufacturers extends Component {
  constructor(){
    super();
    this.state = {items: []}
  }
  componentWillMount() {
    fetch('/manufacturers')
      .then( responce => responce.json() )
      .then( ({manufacturers: items}) => this.setState({items}))
  }
  render() {
    let items = this.state.items
    return (
      <div>
        {items.map(item =>
          <h4 key={item.id}>{item.name}</h4>)}
      </div>
    )
  }
}

export default Manufacturers

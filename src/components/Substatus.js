import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

class Substatus extends Component {
  constructor() {
    super();
    this.state = {
      items: []
      manufacturer: null
    }
  }
  componentWillMount() {
    fetch('/manufacturer/<int>')
  }
}

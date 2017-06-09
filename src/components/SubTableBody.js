import React, { Component } from 'react'
import { Board } from 'react-trello'

class SubTableBody extends Component {
  constructor(props) {
    super(props)
    this.setLanes = this.setLanes.bind(this);
  }

  setLanes() {
    let sublist = this.props.sublist;
    let subProcesses = sublist.processSteps;
    let lanes = [];
    let lane = {};
    let length = subProcesses.length;
    return length;
    }
  //
  // formatData() {
  //   let formatedData = {
  //     lanes: [
  //       {
  //         id: 'lane1',
  //         title: 'Planned Tasks',
  //         label: '2/2',
  //         cards: [
  //           {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins'},
  //   	    {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
  //         ]
  //       },
  //       {
  //         id: 'lane2',
  //         title: 'Completed',
  //         label: '0/0',
  //         cards: []
  //       }
  //     ]
  //   };
  //   return formatedData;
  // }

	render() {
    let data = this.setLanes();
		return (
      data
      // <Board
      //   draggable
      //   data={data}
      // />
    );
	}
}

export default SubTableBody;

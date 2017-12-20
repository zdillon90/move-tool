import React, { Component } from 'react';
import {
  CardHeader,
  CardTitle,
  CardRightContent,
  Detail,
  Footer
} from '../styles';
import ColorSelect from './ColorSelect';
import Tag from './Tag';


class PolishingCard extends Component {
  constructor(props) {
    super(props);
    this.onColorChange = this.onColorChange.bind(this);
    this.state = {
      jarColors: [{
        id: 0,
        color: 'Red'
      }, {
        id: 1,
        color: 'Orange'
      }, {
        id: 2,
        color: 'Yellow'
      }, {
        id: 3,
        color: 'Green'
      }, {
        id: 4,
        color: 'Blue'
      }, {
        id: 5,
        color: 'Purple'
      }, {
        id: 6,
        color: 'Pink'
      }, {
        id: 7,
        color: 'Black'
      }, {
        id: 8,
        color: 'White'
      }, {
        id: 9,
        color: 'Black'
      }],
      currentJarColor: 'Jar Color'
    }
  }

  onColorChange(color) {
    this.setState({
      currentJarColor: color
    });
  }

  render() {
    const doneCards = this.props.doneCards;
    const xsfMaterialList = [75, 76, 77, 78, 93, 94, 95];
    const premiumList = [133, 134];
    const wsfpMaterial = 62;
    const polishers = ['371', '373'];
    const cardId = this.props.id;
    const title = this.props.title;
    const timer = this.props.timer;
    const timerCardId = React.cloneElement(
      timer,
      {cardId: cardId}
    );
    const wsfpTimer = this.props.wsfpTimer;
    const wsfpTimerCardId = React.cloneElement(
      wsfpTimer,
      {cardId: cardId}
    );
    const premiumTimer = this.props.premiumTimer;
    const premiumTimeCardId = React.cloneElement(
      premiumTimer,
      {cardId: cardId}
    );
    const laneId = this.props.laneId;
    const description = this.props.description;
    const tags = this.props.tags;
    const material = this.props.material;
    const availableColorList = this.state.jarColors;
    const currentJarColor = this.state.currentJarColor;

    let timerElement = null;
    let jarColorElement = null;
    let colorSelect = null;
    let jarLabel = null;

    if (xsfMaterialList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{timerCardId}</CardRightContent>
    } else if (material === wsfpMaterial && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{wsfpTimerCardId}</CardRightContent>;
      // jarColorElement = this.props.jarColor;
      colorSelect = <ColorSelect
                      colorList={availableColorList}
                      currentJarColor={currentJarColor}
                      onColorChange={this.onColorChange}
      >{this.state.currentJarColor}</ColorSelect>
    } else if (premiumList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{premiumTimeCardId}</CardRightContent>;
    }
    let doneElement = null;
    if (polishers.includes(laneId) && doneCards.includes(cardId)) {
      doneElement = (
        <header
          style={{
            borderBottom: '1px solid #eee',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 2,
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'row',
            color: '#ffffff',
            backgroundColor: '#ff0000'
          }}
         >Polishing Done</header>
      );
    }

    return (
      <div>
        {doneElement}
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
          {timerElement}
        </CardHeader>
        <Detail>
          {description}
        </Detail>
        {tags &&
          <Footer>
            {colorSelect}
            {tags.map(tag => <Tag key={tag.title} {...tag} tagStyle={this.props.tagStyle} />)}
          </Footer>}
      </div>
    );
  }

}

export default PolishingCard;

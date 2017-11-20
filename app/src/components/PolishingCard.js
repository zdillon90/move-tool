import React, { Component } from 'react';
import {
  CardHeader,
  CardTitle,
  CardRightContent,
  Detail,
  Footer
} from '../styles';
import Tag from './Tag';


class PolishingCard extends Component {
  render() {
    const doneCards = this.props.doneCards;
    const xsfMaterialList = [75, 76, 77, 78, 93, 94, 95];
    const premiumList = [133, 134];
    const wsfpMaterial = 62;
    const polishers = ['371', '373'];
    const cardId = this.props.id;
    const title = this.props.title;
    // const timer = this.polishingTimer();
    const timer = this.props.timer;
    const timerCardId = React.cloneElement(
      timer,
      {cardId: cardId}
    );
    // const wsfpTimer = this.wsfpPolishingTimer();
    const wsfpTimer = this.props.wsfpTimer;
    const wsfpTimerCardId = React.cloneElement(
      wsfpTimer,
      {cardId: cardId}
    );
    // const premiumTimer = this.premiumPolishingTimer();
    const premiumTimer = this.props.premiumTimer;
    const premiumTimeCardId = React.cloneElement(
      premiumTimer,
      {cardId: cardId}
    );
    const laneId = this.props.laneId;
    const description = this.props.description;
    const tags = this.props.tags;
    const material = this.props.material;
    // const doneCard = this.state.done;
    // const premiumState = this.props.premiumTimeState;
    // console.log(premiumState);

    let timerElement = null;
    // console.log(cardId);
    // console.log(wsfpTimer.state.secondsRemaining);
    if (xsfMaterialList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{timerCardId}</CardRightContent>
    } else if (material === wsfpMaterial && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{wsfpTimerCardId}</CardRightContent>
    } else if (premiumList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{premiumTimeCardId}</CardRightContent>;
    }
    // console.log(this.props.premiumTime);
    let doneElement = null;
    if (polishers.includes(laneId) && doneCards.includes(cardId)) {
      doneElement = (
        <header
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: 2,
            marginBottom: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: '#000000',
            backgroundColor: '#09ff00'
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
            {tags.map(tag => <Tag key={tag.title} {...tag} tagStyle={this.props.tagStyle} />)}
          </Footer>}
      </div>
    );
  }

}

export default PolishingCard;

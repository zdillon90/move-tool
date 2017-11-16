import React, { Component } from 'react';
import {
  CardHeader,
  CardTitle,
  CardRightContent,
  Detail,
  Footer
} from '../styles';
import Tag from './Tag';
import CountdownTimer from './CountdownTimer'


class PolishingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
    this.cardAlert = this.cardAlert.bind(this);
    this.polishingTimer = this.polishingTimer.bind(this);
    this.wsfpPolishingTimer = this.wsfpPolishingTimer.bind(this);
    this.premiumPolishingTimer = this.premiumPolishingTimer.bind(this);
  }

  cardAlert() {
    this.setState({
      done: true
    });
  }

  polishingTimer() {
    return (
      <CountdownTimer
        secondsRemaining={'10'}
        refresh={this.cardAlert}
        polishing
      />
    )
  }

  wsfpPolishingTimer() {
    return (
      <CountdownTimer
        secondsRemaining={'20'}
        refresh={this.cardAlert}
        polishing
      />
    );
  }

  premiumPolishingTimer() {
    return (
      <CountdownTimer
        seconsdsRemaining={'30'}
        refresh={this.cardAlert}
        polishing
      />
    );
  }

  render() {
    const xsfMaterialList = [75, 76, 77, 78, 93, 94, 95];
    const premiumList = [133, 134];
    const wsfpMaterial = 62;
    const polishers = ['371', '373'];
    const title = this.props.title;
    // const timer = this.polishingTimer();
    // const wsfpTimer = this.wsfpPolishingTimer();
    // const premiumTimer = this.premiumPolishingTimer();
    const laneId = this.props.laneId;
    const cardId = this.props.id;
    const description = this.props.description;
    const tags = this.props.tags;
    const material = this.props.material;
    const doneCard = this.state.done;

    let timerElement = null;
    // console.log(cardId);
    // console.log(wsfpTimer.state.secondsRemaining);
    if (xsfMaterialList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{this.polishingTimer()}</CardRightContent>
    } else if (material === wsfpMaterial && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{this.wsfpPolishingTimer()}</CardRightContent>
    } else if (premiumList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{this.premiumPolishingTimer()}</CardRightContent>
    }

    let doneElement = null;
    if (polishers.includes(laneId) && doneCard) {
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

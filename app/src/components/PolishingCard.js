import React, { Component } from 'react';
import {
  CardHeader,
  CardTitle,
  CardRightContent,
  Detail,
  Footer
} from '../styles';
import Tag from './Tag';


/** TODO Use the custom card on react trello here */

class PolishingCard extends Component {
  render() {
    const xsfMaterialList = [75, 76, 77, 78, 93, 94, 95];
    const premiumList = [133, 134];
    const wsfpMaterial = 62;
    const polishers = ['371', '373'];
    const title = this.props.title;
    const timer = this.props.timer;
    const wsfpTimer = this.props.wsfpTimer;
    const premiumTimer = this.props.premiumTimer;
    const laneId= this.props.laneId;
    const description = this.props.description;
    const tags = this.props.tags;
    const material = this.props.material;


    let timerElement = null;
    if (xsfMaterialList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{timer}</CardRightContent>
    } else if (material === wsfpMaterial && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{wsfpTimer}</CardRightContent>
    } else if (premiumList.includes(material) && polishers.includes(laneId)) {
      timerElement = <CardRightContent>{premiumTimer}</CardRightContent>
    }

    return (
      <div>
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

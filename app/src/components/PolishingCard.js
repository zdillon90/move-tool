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
    const title = this.props.title;
    const timer = this.props.timer;
    const description = this.props.description;
    const tags = this.props.tags;
    const source = this.props.source;
    return (
      <div>
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
          <CardRightContent>
            {source}
          </CardRightContent>
        </CardHeader>
        <Detail>
          {description}{' - Timer: '}{timer}{' sec'}
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

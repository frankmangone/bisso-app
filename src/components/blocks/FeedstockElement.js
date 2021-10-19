import React, { Component } from 'react';

class FeedstockElement extends Component {

  render() {
    return (
      <div className="wrapper feedstock-wrapper">
        <button className="option edit" onClick={() => this.props.editElement("feedstock", this.props.index, null)}>&#x270E;</button>
        <button className="option delete" onClick={() => this.props.deleteElement("feedstock", this.props.index, null)}>&#x2716;</button>
        <p>{this.props.feedstock.name}</p>
      </div>
    );
  }

}

export default FeedstockElement;

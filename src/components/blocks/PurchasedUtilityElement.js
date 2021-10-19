import React, { Component } from 'react';

class PurchasedUtilityElement extends Component {

  render() {
    return (
      <div className="wrapper utility-wrapper">
        <button className="option edit" onClick={() => this.props.editElement("purchased_utility", this.props.index, null)}>&#x270E;</button>
        <button className="option delete" onClick={() => this.props.deleteElement("purchased_utility", this.props.index, null)}>&#x2716;</button>
        <p>{this.props.utility.name}</p>
      </div>
    );
  }

}

export default PurchasedUtilityElement;

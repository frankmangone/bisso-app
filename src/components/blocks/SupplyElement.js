import React, { Component } from 'react';

class SupplyElement extends Component {

  render() {
    return (
      <div className="wrapper supply-wrapper">
        <button className="option edit" onClick={() => this.props.editElement("supply", this.props.index, null)}>&#x270E;</button>
        <button className="option delete" onClick={() => this.props.deleteElement("supply", this.props.index, null)}>&#x2716;</button>
        <p>{this.props.supply.name}</p>
      </div>
    );
  }

}

export default SupplyElement;

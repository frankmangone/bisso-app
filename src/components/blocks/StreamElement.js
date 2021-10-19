import React, { Component } from 'react';

class StreamElement extends Component {

  render() {
    return (
      <div className="wrapper stream-wrapper">
        <button className="option edit"
                onClick={() => this.props.editElement("stream", this.props.index, this.props.stage)}>
                            &#x270E;</button>
        <button className="option delete" onClick={() => 
        										this.props.deleteElement("stream", { 
        												stage: this.props.stage, 
        												index: this.props.index
        										})}>&#x2716;</button>
        <p>{this.props.stream.name}</p>
      </div>
    );
  }

}

export default StreamElement;

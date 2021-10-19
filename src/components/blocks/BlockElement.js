import React, { Component } from 'react';

class BlockElement extends Component {

  render() {
    return (
      <div className="wrapper block-wrapper">
        <button className="option edit"
                onClick={() => this.props.editElement("block", this.props.index, this.props.stage-1)}>
                            <i className="fas fa-edit"></i></button>

        <button className="option import" 
                onClick={() => this.props.editElement("block_import", this.props.index, this.props.stage-1)}>
                            <i className="fas fa-download"></i></button>
        <button className="option run"
                onClick={() => this.props.editElement("block_run", this.props.index, this.props.stage-1)}>
                            <i className="far fa-play-circle"></i></button>

        <button className="option delete" onClick={() => 
                            this.props.deleteElement("block", { 
                                stage: this.props.stage - 1, 
                                index: this.props.index
                            })}>
                            <i className="fas fa-times"></i></button>                                        
        <p>{this.props.block.name}</p>

        {/*<button onClick={() => this.props.editElement("block_flowsheet", this.props.index, this.props.stage-1)}>Test</button>*/}
      </div>
    );
  }

}

export default BlockElement;

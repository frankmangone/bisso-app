import React, { Component } from 'react';

class KeyStreamPath extends Component {

  constructor(props) {
    super(props);
    const key_stream = props.key_stream;
    this.state = key_stream;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    const name = event.target.name;
    let aux = this.state;

    if (name.substring(0,4) === "path") {
      let info = name.split("/");

      aux.path[parseInt(info[1])] = parseInt(event.target.value);
    }
    else if (name === "feedstock"){
      aux.feedstock = parseInt(event.target.value);
    }
    else if (name === "stream"){
      let info = event.target.value.split("/");
      
      aux.stream = parseInt(info[1]);
      if (info[0] !== "feed") {
        aux.stage = parseInt(info[0]);
      }
      else {
        aux.stage = info[0];
      }

    }
    else if (name === "value"){
      aux.value = parseFloat(event.target.value);
    }

    const index = this.props.index;

    this.props.saveInputData({
      type: 'key_streams',
      data: aux,
      index: index
    })
  } 


  /* ---------------- */


  render() {
    let stage_index = this.props.stage;
    let stream_options = [];

    // Available streams list --------------------------

    stream_options.push(<option key="feed/0" value="feed/0">FEEDSTOCK</option>) 

    this.props.data.stages.map((stage, i) => {
      if (i < stage_index) {
        stream_options = stream_options.concat(stage.streams.map((stream,j) =>
          <option key={i+"/"+j} value={i+"/"+j}>{stream.name}</option>
        ))
      }

      return null;
    })
    
    return (
      <div className="path-with-input">

        {/* Feedstocks */}
        <select className="feedstock" name="feedstock" value={this.state.feedstock} onChange={ this.handleChange }>
          <option value="undefined"></option>
          {this.props.data.feedstocks.map((feed, k) => 
            <option key={k} value={k}>{feed.name}</option>                
          )}
        </select>

        {/* Technologies/blocks */}
        {this.state.path.map((p, j) =>
          <select key={j} className="block" name={"path/"+j} value={this.state.path[j]} onChange={ this.handleChange }>
            <option value="undefined"></option>
            {this.props.data.stages[j].blocks.map((block, m) => 
              <option key={m} value={m}>{block.name}</option>                
            )}
          </select>    
        )}

        {/* Stream */}
        <select className="stream" name="stream" value={this.state.stage+"/"+this.state.stream} onChange={ this.handleChange }>
          {stream_options}
        </select>
        

        <br />
        <input type="number" step="any" name="value"
               value={this.state.value} onChange={ this.handleChange }/>
        <button className="remove" onClick={() => this.props.removePath( { type: "key_streams", index: this.props.index } )}>&#x2716;</button>
      </div>
    );

  }

}


export default KeyStreamPath;
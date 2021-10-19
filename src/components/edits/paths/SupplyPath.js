import React, { Component } from 'react';

class SupplyPath extends Component {

  constructor(props) {
    super(props);
    this.state = props.supply;

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
    else if (name === "supply"){
      aux.supply = parseInt(event.target.value);
    }
    else if (name === "value"){
      aux.value = parseFloat(event.target.value);
    }


    this.props.saveInputData({
      type: 'supplies',
      data: aux,
      index: this.props.index
    })
  } 


  /* ---------------- */


  render() {
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
        {/* Supply */}
        <select className="supply" name={"supply"} value={this.state.supply} onChange={ this.handleChange }>
          <option value="undefined"></option>
          {this.props.data.supplies.map((supply, k) => 
            <option key={k} value={k}>{supply.name}</option>                
          )}
        </select>
        <br />
        <input type="number" step="any" name="value"
               value={this.state.value} onChange={ this.handleChange }/>
        <button className="remove" onClick={() => this.props.removePath( { type: "supplies", index: this.props.index } )}>&#x2716;</button>
      </div>
    );

  }

}


export default SupplyPath;
import React, { Component } from 'react';

class DirectCostPath extends Component {

  constructor(props) {
    super(props);
    this.state = props.direct_cost;

    this.handlePathChange = this.handlePathChange.bind(this);
  }

  handlePathChange (event) {
    const name = event.target.name;
    let aux = this.state;

    if (name.substring(0,4) === "path") {
      let info = name.split("/");

      aux.path[parseInt(info[1])] = parseInt(event.target.value);
    }
    else if (name === "feedstock"){
      aux.feedstock = parseInt(event.target.value);
    }
    else if (name === "value"){
      aux.value = parseFloat(event.target.value);
    }


    this.props.saveInputData({
      type: 'direct_costs',
      data: aux,
      index: this.props.index
    })
  } 


  /* ---------------- */


  render() {
    return (
      <div className="path-with-input">
        {/* Feedstocks */}
        <select className="feedstock" name="feedstock" value={this.state.feedstock} onChange={ this.handlePathChange }>
          <option value="undefined"></option>
          {this.props.data.feedstocks.map((feed, k) => 
            <option key={k} value={k}>{feed.name}</option>                
          )}
        </select>
        {/* Technologies/blocks */}
        {this.state.path.map((p, j) =>
          <select key={j} className="block" name={"path/"+j} value={this.state.path[j]} onChange={ this.handlePathChange }>
            <option value="undefined"></option>
            {this.props.data.stages[j].blocks.map((block, m) => 
              <option key={m} value={m}>{block.name}</option>                
            )}
          </select>    
        )}
        <br />
        <input type="number" step="any" name="value"
               value={this.state.value} onChange={ this.handlePathChange }/>
        <button className="remove" onClick={() => this.props.removePath( { type: "direct_costs", index: this.props.index } )}>&#x2716;</button>
      </div>
    );

  }

}


export default DirectCostPath;
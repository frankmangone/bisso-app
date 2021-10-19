import React, { Component } from 'react';

class YieldsInput extends Component {

  constructor (props) {
    super(props);
    this.handleTypeChange  = this.handleTypeChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleNestedValueChange = this.handleNestedValueChange.bind(this);

    this.addYield = this.addYield.bind(this);
    this.removeYield = this.removeYield.bind(this);
  }

  handleTypeChange(event) {
    this.props.changeInputType(event.target.value, this.props.index);
  }

  handleValueChange(event) {
    this.props.changeInputValue(event.target.name, event.target.value, this.props.index);
  }

  handleNestedValueChange(event) {
    let aux = event.target.name.split("/");
    aux[1] = parseInt(aux[1]);
    this.props.changeNestedInputValue(this.props.index, aux[0], aux[1], aux[2], event.target.value);
  }

  addYield() {
    this.props.addNestedInput(this.props.index, 'yields', {
      component_name: undefined,
      value: undefined
    })
  }

  removeYield(index) {
    this.props.removeNestedInput(this.props.index, 'yields', index);
  }

  /* ------------ */
  /* ------------ */

  render() {

    return (
      <div className="input-form">

        <button className="remove" onClick={() => this.props.removeInput(this.props.index)}>&#x2716;</button>
        
        <label>
          Input type: &nbsp;
          <select name="type" value={this.props.input.type} onChange={this.handleTypeChange}>
            {this.props.types.map((type, i) => <option key={i} value={type}>{type}</option>)}
          </select>
        </label>
        
        <br /><br />

        <label>
          Aspen hierarchy name: &nbsp;
          <input type="text" name="in_hierarchy" value={this.props.input.in_hierarchy} onChange={this.handleValueChange} />
        </label>
        
        <label>
          &nbsp;&nbsp;|&nbsp;&nbsp;Aspen block name: &nbsp;
          <input type="text" name="aspen_name" value={this.props.input.aspen_name} onChange={this.handleValueChange} />
        </label>

        <br /><br />

        <div className="inner-paths">
          {this.props.input.yields.map((y, i) => 
            <div key={i} className="path">
              <label>Aspen component name: &nbsp;
                <input type="text" name={"yields/"+i+"/component_name"} value={y.component_name} onChange={this.handleNestedValueChange} />
              </label>
              <label>&nbsp;&nbsp;|&nbsp;&nbsp;Yield value: &nbsp;
                <input type="number" name={"yields/"+i+"/value"} value={y.value} onChange={this.handleNestedValueChange} />
              </label>
              <button onClick={ () => this.removeYield(i) }>&#x2716;</button>
            </div>
          )}
          <button onClick={ () => this.addYield() }>+</button>
        </div>

      </div>
    );
  }

}


export default YieldsInput;
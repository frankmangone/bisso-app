import React, { Component } from 'react';

class RecycleInput extends Component {

  constructor (props) {
    super(props);
    this.handleTypeChange  = this.handleTypeChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleTypeChange(event) {
    this.props.changeInputType(event.target.value, this.props.index);
  }

  handleValueChange(event) {
    this.props.changeInputValue(event.target.name, event.target.value, this.props.index);
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
          &nbsp;|&nbsp;Aspen block name: &nbsp;
          <input type="text" name="aspen_name" value={this.props.input.aspen_name} onChange={this.handleValueChange} />
        </label>

        <br /><br />

        <label>
          Aspen recycle stream name: &nbsp;
          <input type="text" name="recycle_stream" value={this.props.input.recycle_stream} onChange={this.handleValueChange} />
        </label>

        <label>
          &nbsp;|&nbsp;Value: &nbsp;
          <input type="number" name="value" value={this.props.input.value} onChange={this.handleValueChange} />
        </label>

      </div>
    );
  }

}



export default RecycleInput;
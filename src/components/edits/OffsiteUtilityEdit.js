import React, { Component } from 'react';

class OffsiteUtilityEdit extends Component {

  constructor(props) {
    super(props);
    this.state = props.data;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  } 

  saveData () {
    this.props.saveEdit({ type: 'offsite_utility', data: this.state });
  }

  render() {
    return (
      <div id="form">
        <div id="fields">
          <label>
            <p>Name</p>
            <input type="text" name="name" maxLength="8"
                   value={this.state.name} onChange={ this.handleChange }/>
          </label>
          <label>
            <p>Units of reference flow (see Offsite Facility Cost below)</p>
            <input type="number" step="any" name="units"
                   value={this.state.units} onChange={ this.handleChange } />
          </label>
          <label>
            <p>A (pre-exponential factor)</p>
            <input type="number" step="any" name="a"
                   value={this.state.a} onChange={ this.handleChange } />
          </label>
          <label>
            <p>B (exponent)</p>
            <input type="number" step="any" name="b"
                   value={this.state.b} onChange={ this.handleChange } />
          </label>
          <p className="equation">
            <u>Offsite Facility Cost:</u>
            <br />
            <br />
            Cost<sub>{this.state.name.slice(0,4)}.</sub>[<span className="units">USD</span>] = <b>{this.state.a}</b>.(W<sub>{this.state.name.slice(0,4)}</sub>[<span className="units">{this.state.units}</span>])<sup><b>{this.state.b}</b></sup>
          </p>
        </div>
        <button id="save-edit" onClick={ () => this.saveData() }>SAVE</button>
      </div>
    );
  }

}


export default OffsiteUtilityEdit;
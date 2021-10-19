import React, { Component } from 'react';

class PurchasedUtilityEdit extends Component {

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
    this.props.saveEdit({ type: 'purchased_utility', data: this.state });
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
            <p>Unit cost (USD/[characteristic unit])</p>
            <input type="number" step="any" name="unit_cost"
                   value={this.state.unit_cost} onChange={ this.handleChange } />
          </label>
          <label>
            <p>Units</p>
            <input type="text" step="any" name="units"
                   value={this.state.units} onChange={ this.handleChange } />
          </label>


        </div>
        <button id="save-edit" onClick={ () => this.saveData() }>SAVE</button>
      </div>
    );
  }

}


export default PurchasedUtilityEdit;
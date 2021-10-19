import React, { Component } from 'react';

//import './OptimizationView.css';

class OptimizationView extends Component {

  constructor (props) {
    super(props);
    this.state = props.data;

    this.handleChange = this.handleChange.bind(this);
    console.log(this.state);
  }

  handleChange (event) {
    let value;

    if (event.target.name === 'lifetime' || event.target.name === 'rate_of_return'
        || event.target.name === 'big_M' || event.target.name === 'base_salary'
        || event.target.name === 'annualization_factor' || event.target.name === 'blanks') {
      value = parseFloat(event.target.value);
    }
    else {
      value = event.target.value;
    }

    this.props.changeOptimizationOptions(event.target.name, value);
  }

  render() {
    const OPT_OPTIONS = [{
      name: "Annualized cost",
      value: "ANNUALIZED_COST"
    }
    ,{
      name: "Net Present Value (NPV)",
      value: "NPV"
    }];

    return (
      <div className="view-container optimization-view">
        <h3>Optimization options</h3>
        <div className="optimization-block">
          <p>Objective function</p>
          <select name="objective_function" value={this.state.objective_function} onChange={this.handleChange}>
            {OPT_OPTIONS.map((str, i) =>
              <option key={i} value={str.value}>{str.name}</option>
            )}
          </select>
        </div>

        <div className="optimization-block">
          <p>Economic parameters</p>
          <hr />
          <label>
            <p>Lifetime of the project (years)</p>
            <input type="number" step="1" name="lifetime" value={this.state.lifetime} onChange={this.handleChange} />
          </label>
          <label>
            <p>Rate of interest (r)</p>
            <input type="number" name="rate_of_interest" value={this.state.rate_of_interest} onChange={this.handleChange} />
          </label>
          <label>
            <p>Base salary of plant operators (USD/year)</p>
            <input type="number" name="base_salary" value={this.state.base_salary} onChange={this.handleChange} />
          </label>
          <label>
            <p>Annualization factor for CAPEX</p>
            <input type="number" name="annualization_factor" value={this.state.annualization_factor} onChange={this.handleChange} />
          </label>
        </div>

        <div className="optimization-block">
          <p>Problem parameters</p>
          <hr />
          <label>
            <p>Big M value</p>
            <input type="number" step="1" name="big_M" value={this.state.big_M} onChange={this.handleChange} />
          </label>
          <label>
            <p>Maximum number of Blank Technologies</p>
            <input type="number" step="1" name="blanks" value={this.state.blanks} onChange={this.handleChange} />
          </label>
        </div>
      </div>
    );
  }

}

export default OptimizationView;

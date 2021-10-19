import React, { Component } from 'react';

class StreamEdit extends Component {

  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(props.data));

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    const name = event.target.name;
    if (event.target.name === 'is_product') {
      console.log(event.target.value);
      if (event.target.value === "on") {
         this.setState({ is_product: false });
      }
      else if (event.target.value === "off") {
        this.setState({ is_product: true });
      }
    }
    else {
      this.setState({ [name]: event.target.value });
    }
  } 

  saveData () {
    this.props.saveEdit({ type: 'stream', data: this.state });
  }

  toggle (name) {
    this.setState({ [name]: !this.state[name] });
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
            <p>Unit cost (USD/kg)</p>
            <input type="number" step="any" name="unit_cost"
                   value={this.state.unit_cost} onChange={ this.handleChange } />
          </label>

          <label>
            <p>Selling price (USD/kg)</p>
            <input type="number" step="any" name="selling_price"
                   value={this.state.selling_price} onChange={ this.handleChange } />
          </label>

          <label>
            <p>Other options</p>
            <span className="toggle">
              <button type="toggle" className={"toggle" + (this.state.is_product ? " toggle_on" : "") }
                      onClick={ () => this.toggle('is_product') }>
                  <i class="fas fa-check"></i>
              </button>
              Stream is a final product 
            </span>
          </label>

        </div>
        <button id="save-edit" onClick={ () => this.saveData() }>SAVE</button>
      </div>
    );
  }

}


export default StreamEdit;
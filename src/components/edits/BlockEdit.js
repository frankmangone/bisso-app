import React, { Component } from 'react';

import KeyStreamPath         from './paths/KeyStreamPath';
import DirectCostPath        from './paths/DirectCostPath';
import OutputPath            from './paths/OutputPath';
import SupplyPath            from './paths/SupplyPath';
import OffsiteUtilityPath    from './paths/OffsiteUtilityPath';
import PurchasedUtilityPath  from './paths/PurchasedUtilityPath';


class BlockEdit extends Component {

  constructor (props) {
    super(props);
    this.state = this.state = JSON.parse(JSON.stringify(props.block));


    this.handleChange  = this.handleChange.bind(this);
    this.saveInputData = this.saveInputData.bind(this);
    this.removePath = this.removePath.bind(this);
  }

  saveInputData (data) {
    let aux = this.state;

    switch (data.type) {

      case 'key_streams':
        aux = aux.key_streams;
        aux[data.index] = data.data;
        this.setState({ key_streams: aux });
        break;

      case 'direct_costs':
        aux = aux.direct_costs;
        aux[data.index] = data.data;
        this.setState({ direct_costs: aux });
        break;

      case 'outputs':
        aux = aux.outputs;
        aux[data.index] = data.data;
        this.setState({ outputs: aux });
        break;

      case 'supplies':
        aux = aux.supplies;
        aux[data.index] = data.data;
        this.setState({ supplies: aux });
        break;

      case 'offsite_utilities':
        aux = aux.offsite_utilities;
        aux[data.index] = data.data;
        this.setState({ offsite_utilities: aux });
        break;

      case 'purchased_utilities':
        aux = aux.purchased_utilities;
        aux[data.index] = data.data;
        this.setState({ purchased_utilities: aux });
        break;

      default:
        break;
    }

  }  

  /* ------------- */

  handleChange (event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
  } 

  /* ------------ */

  saveData () {
    this.props.saveEdit({ type: 'block', data: this.state });
  }

  /* ------------ */

  addKeyStream() {
    let key_streams = this.state.key_streams;
    key_streams.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), stage: "feed", stream: 0, value: 0 });
    this.setState({ key_streams: key_streams });
  }

  addDirectCost() {
    let directs = this.state.direct_costs;
    directs.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), value: 0 });
    this.setState({ direct_costs: directs });
  }

  addOutput() {
    let outputs = this.state.outputs;
    outputs.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), stage: 3, stream: 0, value: 0 });
    this.setState({ outputs: outputs });
  }

  addSupply() {
    let supplies = this.state.supplies;
    supplies.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), supply: 0, value: 0 });
    this.setState({ supplies: supplies });
  }

  addOffsiteUtility() {
    let offsite_utilities = this.state.offsite_utilities;
    offsite_utilities.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), utility: 0, value: 0 });
    this.setState({ offsite_utilities: offsite_utilities });
    console.log('hola');
  }

  addPurchasedUtility() {
    let purchased_utilities = this.state.purchased_utilities;
    purchased_utilities.push({ feedstock: 0, path: (new Array(this.props.stage).fill(0)), utility: 0, value: 0 });
    this.setState({ purchased_utilities: purchased_utilities });
  }

  /* ------------ */
  /* ------------ */

  removePath (data) {
    let aux = this.state;

    switch (data.type) {

      case 'key_streams':
        aux = aux.key_streams;
        aux.splice(data.index, 1);
        this.setState({ key_streams: aux });
        break;

      case 'direct_costs':
        aux = aux.direct_costs;
        aux.splice(data.index, 1);
        this.setState({ direct_costs: aux });
        break;

      case 'outputs':
        aux = aux.outputs;
        aux.splice(data.index, 1);
        this.setState({ outputs: aux });
        break;

      case 'supplies':
        aux = aux.supplies;
        aux.splice(data.index, 1);
        this.setState({ supplies: aux });
        break;

      case 'offsite_utilities':
        aux = aux.offsite_utilities;
        aux.splice(data.index, 1);
        this.setState({ offsite_utilities: aux });
        break;

      case 'purchased_utilities':
        aux = aux.purchased_utilities;
        aux.splice(data.index, 1);
        this.setState({ purchased_utilities: aux });
        break;

      default:
        break;
    }
  }

  /* ------------ */
  /* ------------ */

  render() {

    return (
      <div id="form">
        <div id="fields">

          <label>
            <p>Name</p>
            <input type="text" name="name" maxLength="8"
                   value={this.state.name} onChange={ this.handleChange } />
          </label>

          {/* ------------------------------------ */}
          {/* Key streams */}
          <div className="paths">
            <p>Input streams (key)</p>
            {this.state.key_streams.map((key_stream, i) =>
              <KeyStreamPath key_stream={key_stream} key={i} index={i} stage={this.props.stage} data={this.props.data}
                             saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}
            <button className="add" onClick={ () => this.addKeyStream() }>+</button>
          </div>

          {/* ------------------------------------ */}
          {/* Supplies */}
          <div className="paths">
            <p>Input streams (non-key and supplies)</p>
            {this.state.supplies.map((supply, i) =>
              <SupplyPath supply={supply} key={i} index={i} data={this.props.data} 
                          saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}

            <button className="add" onClick={ () => this.addSupply() }>+</button>
          </div>

          {/* ------------------------------------ */}
          {/* Outputs */}
          <div className="paths">
            <p>Output streams</p>
            {this.state.outputs.map((output, i) =>
              <OutputPath output={output} key={i} index={i} stage={this.props.stage} data={this.props.data} 
                          saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}
            <button className="add" onClick={ () => this.addOutput() }>+</button>
          </div>

          {/* ------------------------------------ */}
          {/* Purchased utilities */}
          <div className="paths">
            <p>Utilities (purchased)</p>
            {this.state.purchased_utilities.map((utility, i) =>
              <PurchasedUtilityPath purchased_utility={utility} key={i} index={i} data={this.props.data} 
                                    saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}
            <button className="add" onClick={ () => this.addPurchasedUtility() }>+</button>
          </div>

          {/* ------------------------------------ */}
          {/* Offsite utilities */}
          <div className="paths">
            <p>Utilities (offsite)</p>
            {this.state.offsite_utilities.map((utility, i) =>
              <OffsiteUtilityPath offsite_utility={utility} key={i} index={i} data={this.props.data}
                                  saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}
            <button className="add" onClick={ () => this.addOffsiteUtility() }>+</button>
          </div>

          {/* ------------------------------------ */}
          {/* Direct costs */}
          <div className="paths">
            <p>Equipment costs (installed)</p>
            {this.state.direct_costs.map((direct_cost, i) =>
              <DirectCostPath direct_cost={direct_cost} key={i} index={i} data={this.props.data}
                              saveInputData={ this.saveInputData } removePath={ this.removePath } />
            )}
            <button className="add" onClick={ () => this.addDirectCost() }>+</button>
          </div>


          {/* ------------------------------------ */}
          {/* Operations per type */}
          <label>
            <p># Solids only operations in block</p>
            <input type="number" name="sol"
                   value={this.state.sol} onChange={ this.handleChange } />
          </label>

          <label>
            <p># Mixed solids and fluids operations in block</p>
            <input type="number" name="sol_flu"
                   value={this.state.sol_flu} onChange={ this.handleChange } />
          </label>

          <label>
            <p># Fluids only operations in block:</p>
            <input type="number" name="flu"
                   value={this.state.flu} onChange={ this.handleChange } />
          </label>

        </div>
        <button id="save-edit" onClick={ () => this.saveData() }>SAVE</button>
      </div>
    );
  }

}


export default BlockEdit;
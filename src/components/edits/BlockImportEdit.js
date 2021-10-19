import React, { Component } from 'react';

class BlockImportEdit extends Component {

  constructor (props) {
    super(props);

    this.state = {
      feedstock: null,

      path: [],

      key_stream: [{
        aspen_name: null,
        problem_name: null,
        value: null
      }],

      outputs: [{
        aspen_name: null,
        problem_name: null,
        value: null
      }],

      supplies: [{
        aspen_name: null,
        problem_name: null,
        value: null
      }]

    }

    this.state.path = new Array(this.props.stage);
    this.state.path.fill(null);

    this.handleEditChange  = this.handleEditChange.bind(this);
  }

  handleEditChange(event) {
    // ---- Path

    if (event.target.name === 'feedstock') {
      if (event.target.value !== "undefined") {
        this.setState({ feedstock: parseInt(event.target.value) });
      }
      else {
        this.setState({ feedstock: null });        
      }
    }

    if (event.target.name.split("/")[0] === "path") {
      let aux = this.state.path;
      let index = parseInt( event.target.name.split("/")[1] );
       
      if (event.target.value !== "undefined") {
        aux[index] = parseInt(event.target.value);
      }
      else {
        aux[index] = null
      }
      this.setState({ path: aux });
    }

    // ---- Key stream

    if (event.target.name === 'key_stream_aspen_name') {
      let aux = this.state.key_stream;
      aux[0].aspen_name = event.target.value;
      this.setState({ key_stream: aux });
    }

    if (event.target.name === 'key_stream_problem_name') {
      let aux = this.state.key_stream;
      aux[0].problem_name = event.target.value;
      this.setState({ key_stream: aux });
    }

    // ---- Outputs

    if (event.target.name.split("/")[0] === 'output_aspen_name') {
      let aux = this.state.outputs;
      let index = parseInt(event.target.name.split("/")[1]);
      aux[index].aspen_name = event.target.value;
      this.setState({ outputs: aux });
    }

    if (event.target.name.split("/")[0] === 'output_problem_name') {
      let aux = this.state.outputs;
      let index = parseInt(event.target.name.split("/")[1]);
      aux[index].problem_name = event.target.value;
      this.setState({ outputs: aux });
    }

    // ---- Supplies

    if (event.target.name.split("/")[0] === 'supply_aspen_name') {
      let aux = this.state.supplies;
      let index = parseInt(event.target.name.split("/")[1]);
      aux[index].aspen_name = event.target.value;
      this.setState({ supplies: aux });
    }

    if (event.target.name.split("/")[0] === 'supply_problem_name') {
      let aux = this.state.supplies;
      let index = parseInt(event.target.name.split("/")[1]);
      aux[index].problem_name = event.target.value;
      this.setState({ supplies: aux });
    }

  }

  /* ------------ */
  /* ------------ */

  addOutput () {
    let aux = this.state.outputs;
    aux.push({ aspen_name: null, problem_name: null, value: null });
    this.setState({ outputs: aux });
  }

  addSupply () {
    let aux = this.state.supplies;
    aux.push({ aspen_name: null, problem_name: null, value: null });
    this.setState({ supplies: aux });
  }

  removeOutput (ind) {
    let aux = this.state.outputs;
    aux.splice(ind, 1);
    this.setState({ outputs: aux });
  }

  removeSupply (ind) {
    let aux = this.state.supplies;
    aux.splice(ind, 1);
    this.setState({ supplies: aux });
  }


  /* ------------ */
  /* ------------ */

  render() {

    let previous_streams = [];
    let next_streams = [];
    let supplies = [];

    // Key streams options
    previous_streams.push(<option key="FEEDSTOCK" value="FEEDSTOCK">FEEDSTOCK</option>) 
    this.props.data.stages.map((stage, i) => {
      if (i < this.props.stage) {
        previous_streams = previous_streams.concat(stage.streams.map((stream,j) =>
          <option key={i+"/"+j} value={stream.name}>{stream.name}</option>
        ))
      }
      return null;
    });

    // Output options
    this.props.data.stages.map((stage, i) => {
      if (i >= this.props.stage) {
        next_streams = next_streams.concat(stage.streams.map((stream,j) =>
          <option key={i+"/"+j} value={stream.name}>{stream.name}</option>
        ))
      }
      return null;
    })

    // Supply options
    supplies = this.props.data.supplies.map((supply, i) => 
      <option key={i} value={supply.name}>{supply.name}</option>                
    )

    //
    //
    //
    //

    let aspen_filename = "superstructure.bkp";
    let filename = "IMPORT_REQUEST";

    return (
      <div id="form">
       
        <div id="fields">

          <div className="paths">
            <p>Specify the PATH leading to the technology</p>
            <div className="path-with-input">
              {/* Feedstocks */}
              <select className="feedstock" name="feedstock" value={this.state.feedstock} onChange={ this.handleEditChange }>
                <option value="undefined"></option>
                {this.props.data.feedstocks.map((feed, k) => 
                  <option key={k} value={k}>{feed.name}</option>                
                )}
              </select>
              {/* Technologies/blocks */}
              {this.state.path.map((p, j) =>
                <select key={j} className="block" name={"path/"+j} value={this.state.path[j]} onChange={ this.handleEditChange }>
                  <option value="undefined"></option>
                  {this.props.data.stages[j].blocks.map((block, m) => 
                    <option key={m} value={m}>{block.name}</option>                
                  )}
                </select>    
              )}
            </div>
          </div>


          <div className="paths">
            <p><b>Key stream</b></p>
            <div className="path-with-input">
                Aspen stream name:&nbsp;
                <input type="text" name="key_stream_aspen_name" value={this.state.key_stream[0].aspen_name} onChange={ this.handleEditChange }/>
                &nbsp;| Associated to stream:&nbsp;
                <select type="text" className="stream" name="key_stream_problem_name"
                        onChange={ this.handleEditChange } value={this.state.key_stream[0].problem_name}>
                  <option value="undefined"></option>
                  {previous_streams}
                </select>
            </div>
          </div>

          <div className="paths">
            <p><b>Inputs (non-key and supplies)</b></p>
            {this.state.supplies.map((supply, i) =>
              <div key={i} className="path-with-input">
                  Aspen stream name:&nbsp;
                  <input type="text" name={"supply_aspen_name/"+i} value={supply.aspen_name} onChange={ this.handleEditChange }/>
                  &nbsp;| Associated to stream:&nbsp;
                  <select type="text" className="supply" name={"supply_problem_name/"+i} value={supply.problem_name} onChange={ this.handleEditChange }>
                    <option value="undefined"></option>
                    {supplies}
                  </select>
                  <button className="remove" onClick={() => this.removeSupply(i)}>&#x2716;</button>
              </div>
            )}
            <button className="add" onClick={() => this.addSupply()}>+</button>
          </div>

          <div className="paths">
            <p><b>Outputs</b></p>
            {this.state.outputs.map((output, i) =>
              <div key={i} className="path-with-input">
                  Aspen stream name:&nbsp;
                  <input type="text" name={"output_aspen_name/"+i} value={output.aspen_name} onChange={ this.handleEditChange }/>
                  &nbsp;| Associated to stream:&nbsp;
                  <select type="text" className="stream" name={"output_problem_name/"+i} value={output.problem_name} onChange={ this.handleEditChange }>
                    <option value="undefined"></option>
                    {next_streams}
                  </select>
                  <button className="remove" onClick={() => this.removeOutput(i)}>&#x2716;</button>
              </div>
            )}
            <button className="add" onClick={() => this.addOutput()}>+</button>
          </div>

         </div>

         <a href={"data:text/plain;charset=utf-8,"+encodeURIComponent( JSON.stringify({ [aspen_filename]: this.state })) }
            download={filename+".json"}
            id="download">Get data from Aspen</a>
      </div>
    );
  }

}


export default BlockImportEdit;
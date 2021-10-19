import React, { Component } from 'react';
import TabsDisplay from './components/TabsDisplay';

import BlocksView  from './components/BlocksView';
import StreamsView from './components/StreamsView';
import OptimizationView from './components/OptimizationView';
import ExportView  from './components/ExportView';

import EditWindow  from './components/EditWindow';

import data from './data.json';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      'active_tab': 'blocks',
      'editing': false,
      'editing_data': {
        'type': null, 
        'stage': null,
        'index': null
      },
      'data': data,
      'element_count': 1
    }

    this.updateTab =     this.updateTab.bind(this);

    this.addElement =    this.addElement.bind(this);
    this.editElement =   this.editElement.bind(this);
    this.deleteElement = this.deleteElement.bind(this);

    this.closeEdit =     this.closeEdit.bind(this);
    this.saveEdit =      this.saveEdit.bind(this);

    this.saveQueueData =  this.saveQueueData.bind(this);
    this.saveImportData = this.saveImportData.bind(this);

    this.changeOptimizationOptions = this.changeOptimizationOptions.bind(this);

    this.saveFullData = this.saveFullData.bind(this);

    this.addStage = this.addStage.bind(this);
    this.deleteStage = this.deleteStage.bind(this);
  }

  addElement(element_type, data) {
    let auxiliar = this.state.data;

    switch (element_type) {
      case 'block':
        // data = index
        auxiliar.stages[data].blocks.push({ 
          name: "NEW-BLOCK-"+this.state.element_count,
          sol: 0,
          sol_flu: 0,
          flu: 0,
          direct_costs: [],
          outputs: [],
          supplies: [],
          offsite_utilities: [],
          purchased_utilities: [],
          key_streams: []
        });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      case 'stream':
        // data = index
        auxiliar.stages[data].streams.push({ "name": "NEW-STR-"+this.state.element_count });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      case 'feedstock':
        auxiliar.feedstocks.push({ "name": "NEW-FEED-"+this.state.element_count });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      case 'supply':
        auxiliar.supplies.push({ "name": "NEW-SUP-"+this.state.element_count });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      case 'offsite_utility':
        auxiliar.offsite_utilities.push({ "name": "NEW-UTIL-"+this.state.element_count });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      case 'purchased_utility':
        auxiliar.purchased_utilities.push({ "name": "NEW-UTIL-"+this.state.element_count });
        this.setState({ data: auxiliar });
        this.setState({ element_count: this.state.element_count+1 });
        break;
      default:
        break;
    }
  }

  deleteElement(element_type, data) {
    let auxiliar = this.state.data;

    switch (element_type) {
      case 'block':
        // data = { stage, index }
        console.log(auxiliar.stages[data.stage]);
        auxiliar.stages[data.stage].blocks.splice(data.index, 1);
        this.setState({ data: auxiliar });
        break;
      case 'stream':
        // data = { stage, index }
        auxiliar.stages[data.stage].streams.splice(data.index, 1);
        this.setState({ data: auxiliar });
        break;
      case 'feedstock':
        // data = index
        auxiliar.feedstocks.splice(data, 1);
        this.setState({ data: auxiliar });
        break;
      case 'supply':
        // data = index
        auxiliar.supplies.splice(data, 1);
        this.setState({ data: auxiliar });
        break;
      case 'offsite_utility':
        // data = index
        auxiliar.offsite_utilities.splice(data, 1);
        this.setState({ data: auxiliar });
        break;
      case 'purchased_utility':
        // data = index
        auxiliar.purchased_utilities.splice(data, 1);
        this.setState({ data: auxiliar });
        break;
      default:
        break;
    }
  }

  editElement(element_type, index, stage) {
    //console.log(element_type);
    this.setState({
      editing: true,
      editing_data: {
        type: element_type,
        index: index,
        stage: stage
      }
    });
  }

  closeEdit () {
    this.setState({
      editing: false
    });
  }

  saveEdit(save_data) {
    // Add conditional saving if errors are present

    let index = this.state.editing_data.index;
    let stage = this.state.editing_data.stage;
    let aux;

    switch (save_data.type) {
      case 'block':
        aux = this.state.data;
        aux.stages[stage].blocks[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'stream':
        aux = this.state.data;
        aux.stages[stage].streams[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'feedstock':
        aux = this.state.data;
        aux.feedstocks[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'supply':
        aux = this.state.data;
        aux.supplies[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'offsite_utility':
        aux = this.state.data;
        aux.offsite_utilities[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'purchased_utility':
        aux = this.state.data;
        aux.purchased_utilities[index] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      case 'queue':
        aux = this.state.data;
        aux.queue[index].data.blocks[stage] = save_data.data;
        this.setState({ data: aux });
        this.closeEdit();
        break;
      default:
        break;
    }

    console.log(this.state.data)
  }


  updateTab(tab) {
    this.setState({ active_tab: tab });
  }

  /* -------------------- */
  /* -------------------- */

  addStage () {
    let aux = this.state.data;
    let num = aux.stages.length;
    aux.stages.push({
      number: num+1,
      blocks: [],
      streams: []
    });
    aux.stages[num].blocks.push({
          name: "BLANK-"+(num+1),
          sol: 0,
          sol_flu: 0,
          flu: 0,
          direct_costs: [],
          outputs: [],
          supplies: [],
          offsite_utilities: [],
          purchased_utilities: [],
          key_streams: [],
          disabled: true
    });

    this.setState({ data: aux });
  }

  deleteStage (index) {
    let aux = this.state.data
    // First, delete every path that could include data from this stage.
    for (var i = index+1; i < aux.stages.length; i++) {

      aux.stages[i].number -= 1;
      aux.stages[i].blocks[0].name = "BLANK-"+(i-1);

      for(var j = 0; j < aux.stages[i].blocks.length; j++) {
        // Direct costs
        for(var k = 0; k < aux.stages[i].blocks[j].direct_costs.length; k++) {
          aux.stages[i].blocks[j].direct_costs[k].path.splice(index,1);
        }

        // Key streams
        for(k = 0; k < aux.stages[i].blocks[j].key_streams.length; k++) {
          aux.stages[i].blocks[j].key_streams[k].path.splice(index,1);
        }

        // Outputs
        for(k = 0; k < aux.stages[i].blocks[j].outputs.length; k++) {
          aux.stages[i].blocks[j].outputs[k].path.splice(index,1);
        }

        // Supplies
        for(k = 0; k < aux.stages[i].blocks[j].supplies.length; k++) {
          aux.stages[i].blocks[j].supplies[k].path.splice(index,1);
        }

        // Purchased utilities
        for(k = 0; k < aux.stages[i].blocks[j].purchased_utilities.length; k++) {
          aux.stages[i].blocks[j].purchased_utilities[k].path.splice(index,1);
        }

        // Offsite utilities
        for(k = 0; k < aux.stages[i].blocks[j].offsite_utilities.length; k++) {
          aux.stages[i].blocks[j].offsite_utilities[k].path.splice(index,1);
        }
      }       
    }  

    aux.stages.splice(index, 1);

    this.setState({ data: aux });  
  }


  /* -------------------- */
  /* -------------------- */

  saveQueueData (queue) {
    this.setState({
      queue: queue
    });
  }

  /* -------------------- */
  /* -------------------- */

  saveImportData (stage, index, data) {

    // Despues tengo que convertir "feedstock" y "path", porque van a ser strings y los tengo que pasar a integers
    // !!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!

    let original_data = this.state.data;
    let block = original_data.stages[stage].blocks[index];
    let aux;
    let some_random_info;

    // key streams --------------------------------------------------------------------------

    for (var i = block.key_streams.length - 1; i > -1; i--) {
      if (this.arraysAreEqual(block.key_streams[i].path, data.path) 
              && block.key_streams[i].feedstock === data.feedstock) {
        //
        block.key_streams.splice(i,1);
      }
    }
    aux = {};
    aux.feedstock = data.feedstock;
    aux.path = data.path;
    aux.value = data.key_stream[0].value;
    some_random_info = this.getStageAndIndexOfStream(data.key_stream[0].problem_name);
    aux.stream = some_random_info["stream"];
    aux.stage = some_random_info["stage"];
    block.key_streams.unshift(aux);

    // outputs --------------------------------------------------------------------------

    for (i = block.outputs.length - 1; i > -1; i--) {
      if (this.arraysAreEqual(block.outputs[i].path, data.path) 
              && block.outputs[i].feedstock === data.feedstock) {
        //
        block.outputs.splice(i,1);
      }
    }
    for (i = 0; i < data.outputs.length; i++) {
      aux = {};
      aux.feedstock = data.feedstock;
      aux.path = data.path;
      aux.value = data.outputs[i].value;
      some_random_info = this.getStageAndIndexOfStream(data.outputs[i].problem_name);
      aux.stream = some_random_info["stream"];
      aux.stage = some_random_info["stage"];
      block.outputs.unshift(aux);
    }


    // supplies --------------------------------------------------------------------------

    for (i = block.supplies.length - 1; i > -1; i--) {
      if (this.arraysAreEqual(block.supplies[i].path, data.path) 
              && block.supplies[i].feedstock === data.feedstock) {
        //
        block.supplies.splice(i,1);
      }
    }
    for (i = 0; i < data.supplies.length; i++) {
      aux = {};
      aux.feedstock = data.feedstock;
      aux.path = data.path;
      aux.value = data.supplies[i].value;
      aux.supply = this.getIndexOfSupply(data.supplies[i].problem_name);
      block.supplies.unshift(aux);
    }

    //

    original_data.stages[stage].blocks[index] = block;
    console.log(block);
    this.setState({ data: original_data });
  }

  //

  arraysAreEqual (a, b) {
    if (a.length !== b.length) {
      return false;
    }
    else {
      let flag = true;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  }

  //

  getStageAndIndexOfStream (name) {
    let ret = {};
    let stages = this.state.data.stages;

    if (name === "FEEDSTOCK") {
      ret = { stage: "feed", stream: 0 };
    }
    else {
      for (var i = 0; i < stages.length; i++) {
        for(var j = 0; j < stages[i].streams.length; j++) {
          if (stages[i].streams[j].name === name) {
            ret = { stage: i, stream: j }
          }
        }
      }
    }

    return ret;
  }

  //

  getIndexOfSupply (name) {
    let ret = null;
    let supplies = this.state.data.supplies;
    for (var i = 0; i < supplies.length; i++) {
        if (supplies[i].name === name) {
          ret = i;
        }
    }
    return ret;
  }

  //

  changeOptimizationOptions (name, value) {
    let aux = this.state.data;
    aux.optimization_options[name] = value;
    this.setState({ data: aux });
  }

  /* -------------------- */
  /* -------------------- */

  saveFullData (data) {
    this.setState({ data: data });
  }

  render() {
    let current_view;

    switch (this.state.active_tab) {
      case 'blocks':
        current_view = <BlocksView stages={this.state.data.stages}
                                   addElement={this.addElement}
                                   editElement={this.editElement}
                                   deleteElement={this.deleteElement}
                                   saveImportData={this.saveImportData}
                                   saveFullData={this.saveFullData}
                                   addStage={this.addStage}
                                   deleteStage={this.deleteStage} />;                       
        break;

      case 'streams':
        current_view = <StreamsView feedstocks={this.state.data.feedstocks}
                                    stages={this.state.data.stages}
                                    supplies={this.state.data.supplies}
                                    offsite_utilities={this.state.data.offsite_utilities}
                                    purchased_utilities={this.state.data.purchased_utilities}
                                    addElement={this.addElement} 
                                    editElement={this.editElement}
                                    deleteElement={this.deleteElement} />;
        break;

      case 'optimization':
        current_view = <OptimizationView  data={this.state.data.optimization_options}
                                          changeOptimizationOptions={this.changeOptimizationOptions} />;
        break;
          
      case 'export':
        current_view = <ExportView  data={this.state.data} />;
        break;
      
      default:
        break;
    }

    /* ------- */

    let edit_window = [];

    if (this.state.editing) {
      edit_window = <EditWindow data={this.state.data} editing_data={this.state.editing_data}
                                closeEdit={this.closeEdit} saveEdit={this.saveEdit} /> 
    }

    return (
      <div>
        <TabsDisplay active_tab={this.state.active_tab} updateTab={this.updateTab}/>
        {current_view}
        {edit_window}
      </div>
    );
  }
}

export default App;

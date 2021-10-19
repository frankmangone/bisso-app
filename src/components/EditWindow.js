import React, { Component } from 'react';


import OffsiteUtilityEdit   from './edits/OffsiteUtilityEdit';
import PurchasedUtilityEdit from './edits/PurchasedUtilityEdit';
import SupplyEdit        from './edits/SupplyEdit';
import FeedstockEdit     from './edits/FeedstockEdit';
import StreamEdit        from './edits/StreamEdit';
import BlockEdit         from './edits/BlockEdit';
import BlockImportEdit   from './edits/BlockImportEdit';
import BlockRunEdit      from './edits/BlockRunEdit';
import BlockFlowsheetEdit   from './edits/BlockFlowsheetEdit';

import './EditWindow.css';

class EditWindow extends Component {

  constructor (props) {
    super(props);

    this.state = props.data;
  }

  closeEditCarefully () {
    this.props.closeEdit(this.props.data);
  }

  render() {
  	const index = this.props.editing_data.index;
  	const stage = this.props.editing_data.stage;
  	let editType;

  	switch (this.props.editing_data.type) {
  		case 'block':
    		editType = <BlockEdit block={this.state.stages[stage].blocks[index]}
                              data={this.state}
                              stage={stage}
                              index={index}
                              saveEdit={this.props.saveEdit} />
  		  break;

      case 'block_import':
        editType = <BlockImportEdit block={this.state.stages[stage].blocks[index]}
                                    stage={stage}
                                    index={index} 
                                    data={this.props.data}/>
        break;

      case 'block_run':
        editType = <BlockRunEdit block={this.state.stages[stage].blocks[index]}
                                    stage={stage}
                                    index={index} 
                                    data={this.props.data}/>
        break;

      case 'block_flowsheet':
        editType = <BlockFlowsheetEdit block={this.state.stages[stage].blocks[index]}
                                       stage={stage}
                                       index={index} 
                                       data={this.props.data}/>
        break;

  		case 'stream':
    		editType = <StreamEdit    data={this.props.data.stages[stage].streams[index]} saveEdit={this.props.saveEdit} />
    		break;

  		case 'feedstock':
    		editType = <FeedstockEdit data={this.props.data.feedstocks[index]} saveEdit={this.props.saveEdit} />
    		break;

  		case 'supply':
    		editType = <SupplyEdit    data={this.props.data.supplies[index]} saveEdit={this.props.saveEdit} />
    		break;

  		case 'offsite_utility':
    		editType = <OffsiteUtilityEdit data={this.props.data.offsite_utilities[index]} saveEdit={this.props.saveEdit} />
    		break;

      case 'purchased_utility':
        editType = <PurchasedUtilityEdit data={this.props.data.purchased_utilities[index]} saveEdit={this.props.saveEdit} />
        break;


      default:
        break;
  	}

    let title;

    switch (this.props.editing_data.type) {
      case 'block':
        title = 'Block';
        break;

      case 'block_import':
        title = 'Block Import';
        break;

      case 'stream':
        title = 'Stream';
        break;

      case 'feedstock':
        title = 'Feedstock';
        break;

      case 'supply':
        title = 'Supply';
        break;

      case 'utility':
        title = 'Utility';
        break;

      default:
        break;
    }


    return (
      <div id="edit-container">
        <div id="edit-area">
        	<button id="close-edit" onClick={ () => this.closeEditCarefully() }>&#x2716;</button>
        	<h2>Edit {title}</h2>
        	{editType}
       	</div>
      </div>
    );
  }

}

export default EditWindow;



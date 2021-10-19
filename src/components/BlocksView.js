import React, { Component } from 'react';

import BlockElement from './blocks/BlockElement';

import './BlocksView.css';

class BlocksView extends Component {

	constructor (props) {
		super(props);
		this.tryLoadingFile = this.tryLoadingFile.bind(this);
		this.state = {
			import_from: undefined
		}
	}
  
	askForFile (s) {
		this.setState({ import_from: s });
		document.getElementById("file-load").click();
	}

	tryLoadingFile (files) {
		let file = files[0];
		let fr = new FileReader();
		var json = null;



		fr.onload = function (e) {
			let data = fr.result;
			if(!!data) {
	    		try {
	        		json = JSON.parse(data);
	    		} 
	    		catch(e) {
	        		alert('Error: el archivo no tiene el formato correcto (JSON)');
	    		}
			}

			if (!!json) {
				// Agregar manejo de errores que puedan venir adjuntos al archivo
				if (this.state.import_from === 'aspen') {
					let name = Object.keys(json)[0];
					let indices = this.searchBlockIndex(name);

					if (!!indices) {
						this.props.saveImportData(indices.stage, indices.index, json[name]);

						document.getElementById("file-load").value = ""; // Reset field
					}

					else {
						// Error: no se ha encontrado el nombre de la tecnologia
					}
				}

				else if (this.state.import_from === 'data') {
					this.props.saveFullData(json);
					document.getElementById("file-load").value = "";
				}
			}

		}.bind(this);

		fr.readAsText(file);
	}

	searchBlockIndex (name) {
		let result = null;
		let stages = this.props.stages;

		for (var i = 0; i < stages.length; i++) {
			for (var j = 0; j < stages[i].blocks.length; j++) {
				if (stages[i].blocks[j].name === name) {
					result = {
						stage: i,
						index: j
					};
				} 
			}
		}

		return result;
	}

	/* -------------- */

	addStage () {
		this.props.addStage();
	}

	deleteStage (index) {
		this.props.deleteStage(index);
	}

	/* -------------- */

	render() {
		let stageList = this.props.stages.map((data, i) =>
			<div key={i} className="stage">
				<button className="delete-stage" onClick={() => this.deleteStage(i)}><i className="fas fa-times"></i></button>
				<h3>Stage {data.number}</h3> 
				{data.blocks.map((block, i) => <BlockElement block={block}
															 key={i}
															 stage={data.number}
	                                                         index={i}
	                                                         editElement={this.props.editElement}
	                                                         deleteElement={this.props.deleteElement} />)}
				<button className="add" onClick={() => this.props.addElement('block',data.number-1)}>+</button>
			</div>
		);

		return (
			<div>
				<div id="import-buttons">
					<button className="import-button" onClick={ () => this.askForFile('aspen') }>Import from Aspen</button>
					<button className="import-button" onClick={ () => this.askForFile('data') }>Import saved Data</button>
				</div>
				<input type="file" id="file-load" onChange={ (e) => this.tryLoadingFile(e.target.files) } />
				<div id="blocks-view" className="view-container">
					{stageList}
					<button className="add-stage" onClick={ () => this.addStage() }>+</button>
				</div>
			</div>
	    );
	}

}

export default BlocksView;
                                                         
                                                         
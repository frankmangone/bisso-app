import React, { Component } from 'react';
import './TabsDisplay.css';

class TabsDisplay extends Component {

  setActiveState(tab) {
    this.props.updateTab(tab);
  }

  render() {
    return (
      <header id="TabsDisplay">
        <ul>
          <li onClick={() => this.setActiveState('blocks')}   className={ (this.props.active_tab === 'blocks')   ? 'active' : '' }>Blocks</li>
          <li onClick={() => this.setActiveState('streams')}  className={ (this.props.active_tab === 'streams')  ? 'active' : '' }>Streams & Utilities</li>
          <li onClick={() => this.setActiveState('optimization')}   className={ (this.props.active_tab === 'optimization')   ? 'active' : '' }>Optimization</li>
          <li onClick={() => this.setActiveState('export')}   className={ (this.props.active_tab === 'export')   ? 'active' : '' }>Export</li>
        </ul>
      </header>
    );
  }

}

export default TabsDisplay;

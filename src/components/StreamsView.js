import React, { Component } from 'react';

import FeedstockElement from './blocks/FeedstockElement';
import StreamElement    from './blocks/StreamElement';
import SupplyElement    from './blocks/SupplyElement';
import OffsiteUtilityElement   from './blocks/OffsiteUtilityElement';
import PurchasedUtilityElement from './blocks/PurchasedUtilityElement';

import './StreamsView.css';

class StreamsView extends Component {

  render() {
    let feedstockList = this.props.feedstocks.map((feed, i) =>
      <FeedstockElement key={i}
                        feedstock={feed}
                        index={i}
                        editElement={this.props.editElement}
                        deleteElement={this.props.deleteElement} />
    );

    let streamList = this.props.stages.map((stage, i) =>
      <div key={i} className="horizontal-display">
        <h3>Streams after stage {i+1}</h3>
        {stage.streams.map((stream, j) => <StreamElement stream={stream}
                                                         key={j}
                                                         stage={i}
                                                         index={j}
                                                         editElement={this.props.editElement}
                                                         deleteElement={this.props.deleteElement} />)}
        <button className="add" onClick={() => this.props.addElement('stream',i)}>+</button>
      </div>
    );

    let supplyList = this.props.supplies.map((sup, i) =>
      <SupplyElement key={i}
                     supply={sup}
                     index={i}
                     editElement={this.props.editElement}
                     deleteElement={this.props.deleteElement} />
    );

    let offsiteUtilityList = this.props.offsite_utilities.map((ut, i) =>
      <OffsiteUtilityElement key={i}
                      utility={ut}
                      index={i}
                      editElement={this.props.editElement}
                      deleteElement={this.props.deleteElement} />
    )

    let purchasedUtilityList = this.props.purchased_utilities.map((ut, i) =>
      <PurchasedUtilityElement key={i}
                      utility={ut}
                      index={i}
                      editElement={this.props.editElement}
                      deleteElement={this.props.deleteElement} />
    )

    /* ------- */

    return (
      <div className="view-container">
        <div className="horizontal-display">
          <h3>Feedstocks</h3>
          {feedstockList}
          <button className="add" onClick={() => this.props.addElement('feedstock')}>+</button>
        </div>

        {streamList}

        <div className="horizontal-display">
          <h3>Supplies for the process</h3>
          {supplyList}
          <button className="add" onClick={() => this.props.addElement('supply')}>+</button>
        </div>

        <div className="horizontal-display">
          <h3>Offsite utilities for the process</h3>
          {offsiteUtilityList}
          <button className="add" onClick={() => this.props.addElement('offsite_utility')}>+</button>
        </div>

        <div className="horizontal-display">
          <h3>Purchased utilities for the process</h3>
          {purchasedUtilityList}
          <button className="add" onClick={() => this.props.addElement('purchased_utility')}>+</button>
        </div>
      </div>
    );
  }

}

export default StreamsView;

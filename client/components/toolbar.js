import React from 'react';
import Icon from './icon.js';

export default React.createClass({

  render() {
    return (
      <div className="toolbar">
        <span style={{float: 'right'}}>
          <Icon icon="more-vert"/>
        </span>
      </div>
    );
  }
});

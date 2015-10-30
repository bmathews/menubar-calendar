import React from 'react/addons';
import Icon from './icon.js';

export default React.createClass({

  render() {
    return (
      <div className="toolbar" style={{display: "none"}}>
        <span style={{float: 'right'}}>
          <Icon icon="more-vert"/>
        </span>
      </div>
    );
  }
});

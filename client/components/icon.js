import React from 'react';

/* Subset of the SVG icon collection from the Polymer project (goo.gl/N7SB5G) */

export default React.createClass({
  propTypes: {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      size: 24
    };
  },

  renderGraphic() {
    switch (this.props.icon) {
      case 'menu':
        return (
          <g>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </g>
        );
      case 'chevron-right':
        return (
          <g><path d="M10 6l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6z"></path></g>
        );
      case 'chevron-left':
        return (
          <g><path d="M15.41 7.41l-1.41-1.41-6 6 6 6 1.41-1.41-4.58-4.59z"></path></g>
        );
    }
  },

  render() {
    let styles = {
      fill: "currentcolor",
      verticalAlign: "middle",
      width: this.props.size,
      height: this.props.size
    };
    return (
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" style={styles}>
          {this.renderGraphic()}
      </svg>
    );
  }
});

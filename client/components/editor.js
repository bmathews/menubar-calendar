import React from 'react';

export default React.createClass({
  propTypes: {
    html: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      html: ""
    };
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== React.findDOMNode(this).innerHTML;
  },

  componentDidUpdate() {
    if ( this.props.html !== React.findDOMNode(this).innerHTML ) {
     React.findDOMNode(this).innerHTML = this.props.html;
    }
  },

  emitChange(evt) {
    var html = React.findDOMNode(this).innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      evt.target = { value: html };
      this.props.onChange(html);
    }
    this.lastHtml = html;
  },

  render() {
    return <div className="editor"
      {...this.props}
      onInput={this.emitChange}
      onBlur={this.emitChange}
      contentEditable="true"
      dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
  }
});

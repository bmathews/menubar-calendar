import React from 'react';
import Editor from './editor.js'

var ReactTags = require('react-tag-input').WithContext;
var _ = require('lodash');

export default React.createClass({

  propTypes: {
    onSend: React.PropTypes.func.isRequired,
    profile: React.PropTypes.object.isRequired,
    sending: React.PropTypes.bool.isRequired,
    contacts: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return {
      html: ""
    };
  },

  getInitialState () {
    return {
      recepients: [],
      suggestions: []
    }
  },

  componentWillMount () {
    this._setSuggestions(this.props.contacts);
  },

  componentWillReceiveProps (nextProps) {
    this._setSuggestions(nextProps.contacts);
  },


  /*
   * Set the suggestions based on the contacts prop
   */

  _setSuggestions (contacts) {
    this.setState({
      suggestions: contacts.map(c => c.email)
    });
  },


  /*
   * Handle deleting of a recepient
   */

  _handleDelete (i) {
    var recepients = this.state.recepients;
    recepients.splice(i, 1);
    this.setState({recepients: recepients});
  },


  /*
   * Handle adding of a recepient
   */

  _handleAddition (recepient) {
    if (!this._canAddRecepient(recepient)) { return false }

    var recepients = this.state.recepients;

    recepients.push({
        id: recepient,
        text: recepient
    });

    this.setState({recepients: recepients});
  },


  /*
   * Only add a recepient if it's in the suggestions and not already added
   */

  _canAddRecepient (recepient) {
    return _.contains(this.state.suggestions, recepient) && !_.find(this.state.recepients, _.matchesProperty('text', recepient));
  },


  /*
   * Turn the array of recepients back into their respective contact objects
   */

  _mapRecepientsToContacts (recepients) {
    var contacts = this.props.contacts;
    return recepients.map((r) => {
      return _.find(contacts, _.matchesProperty('email', r.text))
    });
  },


  /*
   * Call props.onSend with message when the button is click
   */

  _handleSendClick () {
    var recepients = this.state.recepients;

    var msg = {
      from: {
        name: this.props.profile.name,
        email: this.props.profile.email
      },
      to: this._mapRecepientsToContacts(recepients),
      subject: "EOD",
      body: this.state.content
    };

    this.props.onSend(msg);
  },


  /*
   * Update internal state whenever the editor's content changes
   */

  _handleEditorChange (content) {
    this.setState({content: content})
  },


  /*
   * Render
   */

  render() {
    return (
      <div className="flex-column flex-1 compose">
        <div className="recipients">
          <span className="label">To </span>
          <ReactTags tags={this.state.recepients}
                    placeholder=""
                    suggestions={this.state.suggestions}
                    handleDelete={this._handleDelete}
                    handleAddition={this._handleAddition} />
        </div>
        <div className="content flex-1 flex-column">
          <Editor onChange={this._handleEditorChange} html={this.state.content} />
          <div>
            <button disabled={this.props.sending} onClick={this._handleSendClick}>Send</button>
          </div>
        </div>
      </div>
    );
  }
});

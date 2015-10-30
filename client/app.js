var ipc = require('ipc');
var React = require('react/addons');

var secrets = require('../secrets.json');

var Icon = require('./components/icon');
var Toolbar = require('./components/toolbar');

var OAuth2 = require('../shared/OAuth2');
var auth = new OAuth2(secrets.oauth);

var mailer = new (require('../shared/mailer'))();
var profile = new (require('../shared/profile'))();
mailer.setAuth(auth);
profile.setAuth(auth);

var google = require('googleapis');
var Q = require('q');

var Configstore = require('configstore');
var conf = new Configstore('eod');

conf.clear();

export default React.createClass({

  getInitialState () {
    return { sending: false };
  },

  componentDidMount () {
    ipc.on('auth.change', this._authChange);
    ipc.send('auth.get');
  },

  componentWillUnmount () {
    ipc.off('auth.change', this._authChange);
  },


  /*
   * Update our auth client whenever we get new access tokens
   */

  _authChange (err, token) {
    if (!err) {
      auth.client.setCredentials(token);
      this._getProfile();
    } else {
      console.error("auth.change error:" + err);
    }
  },


  /*
   * Get the user's profile information
   */

  async _getProfile () {
    try {
      var p = await profile.getProfile();
      this.setState({ profile: p });
    } catch (e) {
      console.error(e, e.stack);
    }
  },


  /*
   * Send the message
   */

  async _handleSend (msg) {
    try {
      this.setState({sending: true });
      await mailer.send(msg);
      this.setState({sending: false });
    } catch (e) {
      this.setState({sending: false });
      console.error(e, e.stack);
    }
  },


  /*
   * Render the tools based on whether we have the contacts/profile yet.
   */

  _renderTools () {
    if (this.state.profile) {
      return ([
        <Toolbar key="toolbar" profile={this.state.profile}/>,
      ]);
    } else {
      return (
        <div style={{display: 'flex', flex: '1', alignItems: 'center', justifyContent: 'center'}}><span>Authenticating...</span></div>
      );
    }
  },


  /*
   * Render
   */

  render () {
    return (
      <div className="flex-column">
        {this._renderTools()}
      </div>
    );
  }
});

var ipc = require('ipc');
var React = require('react/addons');

var secrets = require('../secrets.json');

var Icon = require('./components/icon');
var Toolbar = require('./components/toolbar');
var Calendar = require('./components/calendar/calendar');
var EventList = require('./components/event-list');

var OAuth2 = require('../shared/OAuth2');
var auth = new OAuth2(secrets.oauth);

var profile = new(require('../shared/profile'));
var calendar = new(require('../shared/calendar'));

profile.setAuth(auth);
calendar.setAuth(auth);

var Configstore = require('configstore');
var conf = new Configstore('menu-calendar');

var moment = require('moment');

// conf.clear();

export default React.createClass({

  getInitialState () {
    return {
      sending: false,
      month: moment()
    };
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
      this._getEvents();
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
   * Get the user's events
   */

  async _getEvents () {
    try {
      var events = await calendar.getEvents();
      this.setState({ events: events });
    } catch (e) {
      console.error(e, e.stack);
    }
  },

  onCalendarSelect (date) {
    var el = this.refs.eventlist;
    el.scrollToDate(date);
  },

  /*
   * Render the tools based on whether we have the contacts/profile yet.
   */

  _renderTools () {
    if (this.state.profile && this.state.events) {
      return ([
        <Toolbar key="toolbar" profile={this.state.profile}/>,
        <Calendar key="calendar" selectedDate={new Date()} onChange={this.onCalendarSelect}/>,
        <EventList ref="eventlist" key="events" events={this.state.events}/>
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

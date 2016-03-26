import { ipcRenderer as ipc } from 'electron'

var React = require('react');
var Icon = require('./components/icon');
var Toolbar = require('./components/toolbar');
var Calendar = require('./components/calendar/calendar');
var EventList = require('./components/event-list');

export default React.createClass({

  getInitialState () {
    return {};
  },

  componentDidMount () {
    ipc.on('events.synced', this._updateEvents);
  },

  componentWillUnmount () {
    ipc.off('events.synced', this._updateEvents);
  },

  _updateEvents (sender, events) {
    this.setState({ events: events});
  },


  /*
   * When a date is selected, tell the eventList to scroll to it
   */

  _handleCalendarSelect (date) {
    var el = this.refs.eventlist;
    el.scrollToDate(date);
  },


  /*
   * Render the tools based on whether we have the contacts/profile yet.
   */

  _renderTools () {
    if (this.state.events) {
      return ([
        <Toolbar key="toolbar" profile={this.state.profile}/>,
        <Calendar key="calendar" events={this.state.events} selectedDate={new Date()} onChange={this._handleCalendarSelect}/>,
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

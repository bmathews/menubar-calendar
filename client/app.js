import {
  ipcRenderer as ipc,
  shell
} from 'electron'

var React = require('react');
var Icon = require('./components/icon');
var Toolbar = require('./components/toolbar');
var Calendar = require('./components/calendar/calendar');
var EventList = require('./components/event-list');

export default React.createClass({

  getInitialState () {
    return {
      events: [],
      view: 'week'
    };
  },

  componentDidMount () {
    ipc.on('events.synced', this._updateEvents);
    ipc.on('app.after-show', this._resetDate);
  },

  componentWillUnmount () {
    ipc.off('events.synced', this._updateEvents);
    ipc.off('app.after-show', this._resetDate);
  },

  _updateEvents (sender, events) {
    this.setState({ events: events});
  },

  _resetDate () {
    this.refs.calendar.changeDate();
  },


  /*
   * When a date is selected, tell the eventList to scroll to it
   */

  _handleCalendarSelect (date) {
    var el = this.refs.eventlist;
    el.scrollToDate(date);
  },


  /*
   * When a header is clicked, select the date
   */

  _handleHeaderClick (date) {
    this.refs.calendar.changeDate(date, true);
  },


  /*
   * When an event is clicked, open in browser
   */

  _handleEventClick (event) {
    this.refs.calendar.changeDate(new Date(event.start.dateTime), true);
    shell.openExternal(event.htmlLink);
  },


  /*
   * Render
   */

  render () {
    return (
      <div className="flex-column">
        <Toolbar key="toolbar" profile={this.state.profile}/>
        <Calendar ref="calendar" key="calendar" view={this.state.view} events={this.state.events} selectedDate={new Date()} onChange={this._handleCalendarSelect}/>
        <EventList ref="eventlist" key="events" onHeaderClick={this._handleHeaderClick} onEventClick={this._handleEventClick} events={this.state.events}/>
      </div>
    );
  }
});

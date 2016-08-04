import {
  ipcRenderer as ipc,
  shell
} from 'electron';

import React from 'react';
import Icon from './components/icon';
import Calendar from './components/calendar/calendar';
import EventList from './components/events/eventList';
import eventUtils from './utils/eventUtils';

class App extends React.Component {

  state = {
    events: [],
    view: 'month'
  }

  componentDidMount() {
    ipc.on('events.synced', this._updateEvents);
    ipc.on('app.after-show', this._resetDate);
  }

  componentWillUnmount() {
    ipc.off('events.synced', this._updateEvents);
    ipc.off('app.after-show', this._resetDate);
  }

  /*
   * Fired when sync service has updated
   */

  _updateEvents = (sender, events) => {
    this.setState({ events: events.sort((a, b) => {
      const aStart = eventUtils.getEventStartDate(a);
      const bStart = eventUtils.getEventStartDate(b);
      if (aStart < bStart) return -1;
      if (aStart > bStart) return 1;
      return 0;
    }) });
  }

  _handleMenuClick = () => {
    this.setState({ view: this.state.view === 'month' ? 'week' : 'month' });
  }

  /*
   * Fired when app is shown - set date to today
   */

  _resetDate = () => {
    this.refs.calendar.changeDate();
  }

  /*
   * When a date is selected, tell the eventList to scroll to it
   */

  _handleCalendarSelect = (date) => {
    const el = this.refs.eventlist;
    el.scrollToDate(date);
  }

  /*
   * When a header is clicked, select the date
   */

  _handleHeaderClick = (date) => {
    this.refs.calendar.changeDate(date, true);
  }

  /*
   * When an event is clicked, open in browser
   */

  _handleEventClick = (event) => {
    this.refs.calendar.changeDate(eventUtils.getEventStartDate(event), true);
    shell.openExternal(event.htmlLink);
  }

  /*
   * Render
   */

  render() {
    return (
      <div className="flex-column">
        <div className="menu-icon" onClick={this._handleMenuClick}>
          <Icon icon="menu" />
        </div>
        <Calendar
          ref="calendar"
          key="calendar"
          view={this.state.view}
          events={this.state.events}
          selectedDate={new Date()}
          onChange={this._handleCalendarSelect}
        />
        <EventList
          ref="eventlist"
          key="events"
          onHeaderClick={this._handleHeaderClick}
          onEventClick={this._handleEventClick}
          events={this.state.events}
        />
      </div>
    );
  }
}

export default App;

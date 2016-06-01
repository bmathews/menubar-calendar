import React from 'react';
import time from './timeUtils';
import eventUtils from './eventUtils';
import Day from './day';

class Week extends React.Component {
  static propTypes = {
    onDayClick: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    viewDate: React.PropTypes.object,
    week: React.PropTypes.object,
    events: React.PropTypes.array
  }

  _handleDayClick (day) {
    if (this.props.onDayClick) this.props.onDayClick(day);
  }

  _isSelected (date) {
    const sameYear = date.getFullYear() === this.props.selectedDate.getFullYear();
    const sameMonth = date.getMonth() === this.props.selectedDate.getMonth();
    const sameDay = date.getDate() === this.props.selectedDate.getDate();
    return sameYear && sameMonth && sameDay;
  }

  _renderDays () {
    var days = [];
    var startDate = new Date(this.props.week);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (var i = 0; i < 7; i++) {
      var events = eventUtils.getEventsForDay(startDate, this.props.events);
      days.push(
        <Day
          key={i}
          events={events}
          day={startDate.getDate()}
          onClick={this._handleDayClick.bind(this, new Date(startDate))}
          selected={this._isSelected(startDate)}
          isDifferentMonth={startDate.getFullYear() !== this.props.viewDate.getFullYear() || startDate.getMonth() !== this.props.viewDate.getMonth()}
          viewDate={this.props.viewDate}
        />
      );
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  }

  render () {
    return (
      <div className="week">{this._renderDays()}</div>
    );
  }
}

export default Week;

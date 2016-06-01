import React from 'react';
import time from './timeUtils';
import eventUtils from './eventUtils';
import Week from './week';

class Month extends React.Component {
  static propTypes = {
    onDayClick: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    viewDate: React.PropTypes.object,
    events: React.PropTypes.array
  }

  _renderWeeks () {
    var weeks = [];
    var startDate = time.getFirstDayOfMonth(this.props.viewDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (var i = 0; i < 6; i++) {
      var events = eventUtils.getEventsForWeek(startDate, this.props.events);
      weeks.push(
        <Week
          key={i}
          events={events}
          week={time.clone(startDate)}
          onDayClick={this.props.onDayClick}
          selectedDate={this.props.selectedDate}
          viewDate={this.props.viewDate}
        />
      );
      startDate.setDate(startDate.getDate() + 7);
    }
    return weeks;
  }

  render () {
    return (
      <div className="month">
        <div className="weeks">{ this._renderWeeks() }</div>
      </div>
    );
  }
}

export default Month;

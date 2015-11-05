import React from 'react';
import time from './timeUtils';
import Day from './day';

class Month extends React.Component {
  static propTypes = {
    onDayClick: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    viewDate: React.PropTypes.object
  };

  handleDayClick = (day) => {
    if (this.props.onDayClick) this.props.onDayClick(day);
  };

  renderWeeks () {
    var weeks = [];
    for (var i = 0; i < 7; i++) {
      weeks.push(
        <span key={i}>{ time.getShortDayOfWeek(i) }</span>
      );
    }
    return weeks;
  }

  renderDays () {
    var days = [];
    var startDate = time.getFirstDayOfMonth(this.props.viewDate);
    var offset = startDate.getDay();
    startDate.setDate(startDate.getDate() - offset);

    for (var i = 0; i < 42; i++) {
      days.push(
        <Day
          key={i}
          day={startDate.getDate()}
          onClick={this.handleDayClick.bind(this, new Date(startDate))}
          selectedDate={this.props.selectedDate}
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
      <div className="month">
        <div className="weeks">{ this.renderWeeks() }</div>
        <div className="days">{ this.renderDays() }</div>
      </div>
    );
  }
}

export default Month;

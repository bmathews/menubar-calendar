import React from 'react';
import time from './timeUtils';

class Day extends React.Component {
  static propTypes = {
    day: React.PropTypes.number,
    onClick: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    isDifferentMonth: React.PropTypes.bool,
    viewDate: React.PropTypes.object,
    events: React.PropTypes.array
  }

  isSelected () {
    const sameYear = this.props.viewDate.getFullYear() === this.props.selectedDate.getFullYear();
    const sameMonth = this.props.viewDate.getMonth() === this.props.selectedDate.getMonth();
    const sameDay = this.props.day === this.props.selectedDate.getDate();
    return sameYear && sameMonth && sameDay && !this.props.isDifferentMonth;
  }

  render () {
    const className = 'day' + (this.isSelected() ? ' selected' : '') + (this.props.isDifferentMonth ? ' different-month' : '');
    return (
      <div onClick={this.props.onClick} className={className}>
        <span>
          {this.props.day}
        </span>
        <span className="dots">
          {this.props.events.map((e, i) => {
            return <span key={i} className="dot"></span>
          })}
        </span>
      </div>
    );
  }
}

export default Day;

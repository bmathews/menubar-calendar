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

  componentWilLReceiveProps (nextProps) {

  }

  isSelected () {
    const sameYear = this.props.viewDate.getFullYear() === this.props.selectedDate.getFullYear();
    const sameMonth = this.props.viewDate.getMonth() === this.props.selectedDate.getMonth();
    const sameDay = this.props.day === this.props.selectedDate.getDate();
    return sameYear && sameMonth && sameDay && !this.props.isDifferentMonth;
  }

  _renderEventIndicator () {
    if (this.props.events.length) {
      const eventHours = this.props.events.reduce((total, e) => {
        return total + new Date(e.end.dateTime).getTime() - new Date(e.start.dateTime).getTime();
      }, 0) / 1000 / 60 / 60
      const width = Math.min(eventHours / 8, 100)
      return (
        <span className="dot" style={{width: width * 100 + "%"}}></span>
      )
    }
  }

  render () {
    const className = 'day'
      + (this.isSelected() ? ' selected' : '')
      + (this.props.isDifferentMonth ? ' different-month' : '')
      + (this.props.day < this.props.viewDate.getDate() ? ' past' : '')
    return (
      <div onMouseDown={this.props.onClick} className={className}>
        <div className="day-tooltip"></div>
        <span>
          {this.props.day}
        </span>
        <span className="dots">
          {this._renderEventIndicator()}
        </span>
      </div>
    );
  }
}

export default Day;

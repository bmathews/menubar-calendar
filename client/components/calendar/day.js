import React from 'react';
import classNames from 'classnames';
import timeUtils from '../../utils/timeUtils';
import eventUtils from '../../utils/eventUtils';

class Day extends React.Component {
  static propTypes = {
    date: React.PropTypes.object,
    onClick: React.PropTypes.func,
    selected: React.PropTypes.bool,
    isDifferentMonth: React.PropTypes.bool,
    viewDate: React.PropTypes.object,
    events: React.PropTypes.array
  }


  /*
   * Total the number of hours of events, then display an indicator based on 8 hours a day
   */

  _renderEventIndicator() {
    if (this.props.events.length) {
      const eventHours = this.props.events.reduce((total, e) => (
        total + eventUtils.getHoursForEventOnDate(e, this.props.date)
      ), 0);
      const width = Math.min(eventHours / 8, 1);
      return (
        <span className="dot" style={{ width: `${width * 100}%` }}></span>
      );
    }
    return null;
  }

  /*
   * Call props.onClick with current date
   */
  _handleClick = () => {
    this.props.onClick(this.props.date);
  }

  render() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dayClass = classNames({
      day: true,
      selected: this.props.selected,
      'different-month': this.props.isDifferentMonth,
      past: this.props.date < now,
      today: timeUtils.areSameDay(this.props.date, now)
    });

    return (
      <div onMouseDown={this._handleClick} className={dayClass}>
        <div className="day-tooltip"></div>
        <span>
          {this.props.date.getDate()}
        </span>
        <span className="dots">
          {this._renderEventIndicator()}
        </span>
      </div>
    );
  }
}

export default Day;

import React from 'react';
import classNames from 'classnames';

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
        total + new Date(e.end.dateTime).getTime() - new Date(e.start.dateTime).getTime()
      ), 0) / 1000 / 60 / 60;
      const width = Math.min(eventHours / 8, 100);
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
    const dayClass = classNames({
      day: true,
      selected: this.props.selected,
      'different-month': this.props.isDifferentMonth,
      past: this.props.date < new Date()
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

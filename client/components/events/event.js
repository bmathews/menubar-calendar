import React from 'react';
import timeUtils from '../../utils/timeUtils';
import eventUtils from '../../utils/eventUtils';
import classNames from 'classnames';

class Event extends React.Component {
  static propTypes = {
    event: React.PropTypes.object.isRequired,
    date: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func
  }

  _handleEventClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.event);
    }
  }

  _getTimeRange(start, end) {
    if (timeUtils.areSameDay(start, end)) {
      // same day, format normally
      return `${timeUtils.formatTime(start, 'ampm')} - ${timeUtils.formatTime(end, 'ampm')}`;
    } else if (timeUtils.areSameDay(start, this.props.date)) {
      return `Starts at ${timeUtils.formatTime(start, 'ampm')}`;
    } else if (timeUtils.areSameDay(end, this.props.date)) {
      return `Ends at ${timeUtils.formatTime(end, 'ampm')}`;
    }
    return 'All day';
  }

  render() {
    const event = this.props.event;
    const start = eventUtils.getEventStartDate(event);
    const end = eventUtils.getEventEndDate(event);
    let timeRange = 'All day';
    if (!event.start.date) {
      timeRange = this._getTimeRange(start, end);
    }

    const now = new Date();

    const eventClasses = classNames({
      event: true,
      past: end < now,
      current: now >= start && now <= end
    });

    return (
      <div onMouseDown={this._handleEventClick} className={eventClasses}>
        <div className="name">
          {event.summary || '(No title)'}
          <div className="location">
            {event.location}
          </div>
        </div>
        <div className="time">{timeRange}</div>
      </div>
    );
  }
}

export default Event;

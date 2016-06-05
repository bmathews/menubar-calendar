import React from 'react';
import timeUtils from '../calendar/timeUtils';
import Event from './event';
import _ from 'lodash';

class EventList extends React.Component {

  static propTypes = {
    onEventClick: React.PropTypes.func,
    onHeaderClick: React.PropTypes.func,
    events: React.PropTypes.array.isRequired
  }

  state = {
    groupedEvents: {}
  }

  componentWillReceiveProps(nextProps) {
    this.state.groupedEvents = this._groupEvents(nextProps.events);
  }

  componentWillUnmount() {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame);
    }
  }


  /*
   * Get the group for a date
   */

  _getGroupForDate(date) {
    return timeUtils.prettyFormatDate(date);
  }


  /*
   * Group events by date
   */

  _groupEvents(events) {
    const groups = {};
    const now = new Date();


    // if no events, return only an empty today
    if (!events.length) {
      return {
        [this._getGroupForDate(now)]: []
      };
    }

    let last = now;
    events.forEach(e => {
      const d = new Date(e.start.dateTime || e.start.date);
      d.setHours(0, 0, 0, 0);

      const format = this._getGroupForDate(d);

      // there's no events for today, so create one
      if (last < now && d > now) {
        groups[this._getGroupForDate(now)] = [];
      }

      if (!groups[format]) {
        groups[format] = [e];
      } else {
        groups[format].push(e);
      }


      last = d;
    });

    return groups;
  }


  /*
   * Scroll to a date
   */

  scrollToDate(date) {
    const group = this._getGroupForDate(date);

    const el = this.refs[group];
    if (el) {
      if (this.state.animationFrame) {
        cancelAnimationFrame(this.state.animationFrame);
      }
      this._animateContainer(el.offsetParent, el);
    }
  }


  /*
   * Smoothly animate a container to an element
   */

  _animateContainer(container, el) {
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    const target = el.offsetTop - 10;
    const start = container.scrollTop;
    const time = 250;
    let elapsed = 0;
    let last = new Date().getTime();

    const anim = () => {
      const req = requestAnimationFrame(() => {
        const now = new Date().getTime();
        const delta = now - last;
        elapsed += delta;
        const val = easeInOutQuad(Math.min(elapsed, time), start, target - start, time);
        container.scrollTop = val;
        last = now;
        if (val !== target) {
          anim();
        } else {
          this.state.animationFrame = null;
        }
      });
      this.state.animationFrame = req;
    };
    anim();
  }


  /*
   *  Handle when an event is clicked on
   */

  _handleEventClick = (event) => {
    if (this.props.onEventClick) {
      this.props.onEventClick(event);
    }
  }


  /*
   * Handle when a group header is clicked on
   */

  _handleHeaderClick = (e) => {
    const group = e.currentTarget.innerText;
    if (this.props.onHeaderClick) {
      const d = new Date(group.substr(group.indexOf(' ') + 1));
      this.props.onHeaderClick(d);
    }
  }


  /*
   * Render the individual event item
   */

  _renderEvent = (event, idx) => (
    <Event event={event} key={idx} onClick={this._handleEventClick} />
  )


  /*
   * Render the list of events
   */

  render() {
    const items = _.map(this.state.groupedEvents, (subItems, key) => {
      const header = (
        <div ref={key} className="event-list-header" onMouseDown={this._handleHeaderClick}>{key}</div>
      );
      const els = subItems.map(this._renderEvent);

      if (!els.length && key.indexOf('Today') === 0) {
        els.push(
          <div className="event empty">No events today!</div>
        );
      }

      return [header].concat(els);
    });

    return (
      <div className="event-list">{items}</div>
    );
  }
}

export default EventList;

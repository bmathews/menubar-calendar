import React from 'react';
import moment from 'moment';
import time from './calendar/timeUtils';
import _ from 'lodash';

export default React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      groupedEvents: {}
    }
  },

  componentWillUnmount () {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame);
    }
  },

  componentWillReceiveProps (nextProps) {
    this.state.groupedEvents = this._groupEvents(nextProps.events)
  },


  /*
   * Get the group for a date
   */

  _getGroupForDate(date) {
    return moment(date).calendar(null, {
      lastDay: 'dddd MM/DD/YY',
      lastWeek: 'dddd MM/DD/YY',
      sameDay: '[Today] MM/DD/YY',
      nextDay: '[Tomorrow] MM/DD/YY',
      nextWeek: 'dddd MM/DD/YY'
    });
  },


  /*
   * Group events by date
   */

  _groupEvents (events) {
    return _.groupBy(events, (e) => {
      return this._getGroupForDate(e.start.dateTime || e.start.date);
    });
  },


  /*
   * Scroll to a date
   */

  scrollToDate(date) {
    var group = this._getGroupForDate(date);

    var el = this.refs[group];
    if (el) {
      if (this.state.animationFrame) {
        cancelAnimationFrame(this.state.animationFrame);
      }
      this._animateContainer(el.offsetParent, el)
    }
  },


  /*
   * Smoothly animate a container to an element
   */

  _animateContainer(container, el) {
    var easeInOutQuad = function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };

    var target = el.offsetTop - 10;
    var start = container.scrollTop;
    var time = 250;
    var elapsed = 0;
    var last = new Date().getTime();

    var anim = () => {
      var req = requestAnimationFrame(() => {
        var now = new Date().getTime();
        var delta = now - last;
        elapsed += delta;
        var val = easeInOutQuad(Math.min(elapsed, time), start, target - start, time);
        container.scrollTop = val;
        last = now;
        if (val != target) {
          anim();
        } else {
          this.state.animationFrame = null;
        }
      });
      this.state.animationFrame = req;
    }
    anim();
  },


  /*
   *  Handle when an event is clicked on
   */

  _handleEventClick (event) {
    if (this.props.onEventClick) {
      this.props.onEventClick(event);
    }
  },


  /*
   * Handle when a group header is clicked on
   */

  _handleHeaderClick (group) {
    if (this.props.onHeaderClick) {
      const d = new Date(group.substr(group.indexOf(' ') + 1));
      this.props.onHeaderClick(d);
    }
  },


  /*
   * Render the individual event item
   */

  _renderEvent (event, idx) {
    let name = event.summary;
    let start = new Date(event.start.dateTime);
    let end = new Date(event.end.dateTime);
    let timeRange = `${time.formatTime(start, 'ampm')} - ${time.formatTime(end, 'ampm')}`;
    var now = new Date();
    var isPast = end < now;
    var isCurrent = now >= start && now <= end;

    return (
      <div key={idx} onMouseDown={this._handleEventClick.bind(this, event)} className={"event" + (isPast ? ' past' : '') + (isCurrent ? ' current' : '')}>
        <div className="name">
          {name}
          <div className="location">
            {event.location}
          </div>
        </div>
        <div className="time">{timeRange}</div>
      </div>
    );
  },


  /*
   * Render the list of events
   */

  render () {
    var items = _.map(this.state.groupedEvents, (subItems, key) => {
      var header = (
        <div ref={key} className="event-list-header" onMouseDown={this._handleHeaderClick.bind(this, key)}>{key}</div>
      );
      var els = subItems.map((e, i) => {
        return this._renderEvent(e, i);
      });
      return [header].concat(els);
    })

    return (
      <div className="event-list">{ items }</div>
    );
  }

});

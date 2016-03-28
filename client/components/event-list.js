import React from 'react';
import moment from 'moment';
import _ from 'lodash';

export default React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {}
  },

  componentWillUnmount () {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame);
    }
  },


  /*
   * Group events by date
   */

  _groupEvents () {
    var events = this.props.events;
    return _.groupBy(events, (e) => {
      return moment(e.start.dateTime || e.start.date).calendar(null, {
          lastDay: 'dddd MM/DD/YY',
          lastWeek: 'dddd MM/DD/YY',
          sameDay: '[Today] MM/DD/YY',
          nextDay: '[Tomorrow] MM/DD/YY',
          nextWeek: 'dddd MM/DD/YY'
      });
    });
  },


  /*
   * Scroll to a date
   */

  scrollToDate(date) {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame);
    }

    var group = moment(date).calendar(null, {
        lastDay: 'dddd MM/DD/YY',
        lastWeek: 'dddd MM/DD/YY',
        sameDay: '[Today] MM/DD/YY',
        nextDay: '[Tomorrow] MM/DD/YY',
        nextWeek: 'dddd MM/DD/YY'
    });

    var el = this.refs[group];

    if (el) {
      var p = el.offsetParent;

      var easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      };

      var target = el.offsetTop - 10;
      var start = p.scrollTop;
      var time = 250;
      var elapsed = 0;
      var last = new Date().getTime();

      var anim = () => {
        var req = requestAnimationFrame(() => {
          var now = new Date().getTime();
          var delta = now - last;
          elapsed += delta;
          var val = easeInOutQuad(Math.min(elapsed, time), start, target - start, time);
          p.scrollTop = val;
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
    }
  },


  /*
   * Render the individual event item
   */

  _renderEvent (event, idx) {
    let name = event.summary;
    let start = moment(event.start.dateTime);
    let end = moment(event.end.dateTime);
    let timeRange = `${start.format('h:mm A')} - ${end.format('h:mm A')}`;
    var now = moment();
    var isPast = end.isBefore(now);
    var isCurrent = now.isBetween(start, end);

    return (
      <div key={idx} className={"event" + (isPast ? ' past' : '') + (isCurrent ? ' current' : '')}>
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
    var events = this.props.events;
    let groups = this._groupEvents();
    var items = _.map(groups, (subItems, key) => {
      var header = (
        <div ref={key} className="event-list-header">{key}</div>
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

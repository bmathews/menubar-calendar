import React from 'react/addons';
import moment from 'moment';
import _ from 'lodash';

export default React.createClass({

  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  _groupEvents () {
    var events = this.props.events;
    return _.groupBy(events, (e) => {
      return moment(e.start.dateTime || e.start.date).calendar(null, {
          sameDay: '[Today] MM/DD/YY',
          nextDay: '[Tomorrow] MM/DD/YY',
          nextWeek: 'dddd MM/DD/YY'
      });
    });
  },

  render () {
    var events = this.props.events;
    let groups = this._groupEvents();
    var items = _.map(groups, (subItems, key) => {
      var header = (
        <div className="event-list-header">{key}</div>
      );
      var els = subItems.map((e, i) => {
        return this._renderEvent(e, i);
      });
      return [header].concat(els);
    })

    return (
      <div className="event-list">{ items }</div>
    );
  },

  _renderEvent (event, idx) {
    let name = event.summary;
    let start = moment(event.start.dateTime);
    let end = moment(event.end.dateTime);
    let timeRange = `${start.format('h:mm A')} - ${end.format('h:mm A')}`;

    return (
      <div key={idx} className="event">
        <div className="name">{name}</div>
        <div className="time">{timeRange}</div>
      </div>
    );
  }
});

import React from 'react/addons';
import moment from 'moment';

export default React.createClass({


  propTypes: {
    date: React.PropTypes.object.isRequired,
    events: React.PropTypes.array.isRequired,
    month: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
  },

  render () {
    var days = [];
    var date = this.props.date;
    var month = this.props.month;

    for (var i = 0; i < 7; i++) {
      var eventsThisDay = this.props.events.filter((e) => {
        let d = moment(e.start.dateTime || e.start.date);
        return d.isSame(date, "day");
      });

      var day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };

      var dots = [];
      for (var x = 0; x < eventsThisDay.length; x++) {
        dots.push(
          <span key={x} className="dot"></span>
        );
      }

      var el = (
        <span
          key={day.date.toString()}
          className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.date.isSame(this.props.selected) ? " selected" : "")}
          onClick={this.props.onSelect.bind(null, day)}>
          {day.number}
          <div className="dots">{dots}</div>
        </span>
      );
      days.push(el);
      date = date.clone();
      date.add(1, "d");
    }

    return (
      <div className="week" key={days[0].toString()}>
        {days}
      </div>
    );
  }

});

import React from 'react/addons';
const CSSTransitionGroup = React.addons.CSSTransitionGroup;
import Week from './week';
import Icon from '../icon';
import moment from 'moment';

export default React.createClass({

  propTypes: {
    month: React.PropTypes.object.isRequired,
    events: React.PropTypes.array.isRequired
  },

  getInitialState () {
    return {
      month: this.props.month.clone()
    };
  },

  _previous () {
    var month = this.state.month;
    month.add(-1, "M");
    this.setState({ month: month });
  },

  _next () {
    var month = this.state.month;
    month.add(1, "M");
    this.setState({ month: month });
  },

  _select (day) {
    console.log(day);
  },

  render () {
    return (
      <div className="calendar">
        <div className="header">
          <span className="date">
            <span className="month">{ this.state.month.format("MMMM") }</span>
            <span className="year">{ this.state.month.format("YYYY") }</span>
          </span>
          <span className="previous" onClick={ this._previous }><Icon icon="chevron-left"/></span>
          <span className="next"onClick={this._next}><Icon icon="chevron-right"/></span>
        </div>
        { this._renderDayNames() }
        { this._renderWeeks() }
      </div>
    );
  },

  _renderDayNames () {
    return (
      <div className="week names">
        <span className="day">Sun</span>
        <span className="day">Mon</span>
        <span className="day">Tue</span>
        <span className="day">Wed</span>
        <span className="day">Thu</span>
        <span className="day">Fri</span>
        <span className="day">Sat</span>
      </div>
    );
  },

  _renderWeeks () {
    var weeks = [];
    var done = false;
    var date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday");
    var monthIndex = date.month();
    var count = 0;

    while (!done) {

      let eventsThisWeek = this.props.events.filter((e) => {
        let d = moment(e.start.dateTime || e.start.date);
        return d.isSame(date, "year") && d.isSame(date, "month") && d.isSame(date, "week");
      });

      console.log(eventsThisWeek);

      let week = (
        <Week events={eventsThisWeek} key={ date.toString() } date={ date.clone() } month={ this.state.month } select={ this._select } selected={ this.props.selected } />
      );

      weeks.push(week);
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

});

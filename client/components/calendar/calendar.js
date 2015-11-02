import React from 'react/addons';
import Week from './week';
import Icon from '../icon';
import moment from 'moment';

export default React.createClass({

  propTypes: {
    month: React.PropTypes.object.isRequired,
    events: React.PropTypes.array.isRequired,
    highlightWeek: React.PropTypes.bool,
    onSelect: React.PropTypes.array
  },

  getInitialState () {
    return {
      month: this.props.month.clone()
    };
  },


  /*
   * Navigate to the previous month
   */

  _previousMonth () {
    var month = this.state.month;
    month.add(-1, "M");
    this.setState({ month: month });
  },


  /*
   * Navigate to the next month
   */

  _nextMonth () {
    var month = this.state.month;
    month.add(1, "M");
    this.setState({ month: month });
  },


  /*
   * Select a day
   */

  _selectDay (day) {
    this.setState({
      selected: day.date
    });

    if (this.props.onSelect) {
      this.props.onSelect();
    }
  },


  /*
   * Render calendar
   */

  render () {
    return (
      <div className="calendar">
        <div className="header">
          <span className="date">
            <span className="month">{ this.state.month.format("MMMM") }</span>
            <span className="year">{ this.state.month.format("YYYY") }</span>
          </span>
          <span className="previous" onClick={ this._previousMonth }><Icon icon="chevron-left"/></span>
          <span className="next"onClick={this._nextMonth}><Icon icon="chevron-right"/></span>
        </div>
        { this._renderDayNames() }
        { this._renderWeeks() }
      </div>
    );
  },


  /*
   * Render day names
   */

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


  /*
   * Render all the weeks
   */

  _renderWeeks () {
    var weeks = [];
    var done = false;
    var date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday");
    var count = 0;

    // always render 5 weeks
    for (count = 0; count < 6; count++) {
      let eventsThisWeek = this.props.events.filter((e) => {
        let d = moment(e.start.dateTime || e.start.date);
        return d.isSame(date, "year") && d.isSame(date, "month") && d.isSame(date, "week");
      });

      let week = (
        <Week events={eventsThisWeek} key={ date.toString() } date={ date.clone() } month={ this.state.month } onSelect={ this._selectDay } highlightWeek={this.props.highlightWeek} selected={ this.state.selected } />
      );

      weeks.push(week);
      date.add(1, "w");
    }

    return weeks;
  }

});

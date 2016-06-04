import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Day from './day';
import Icon from '../icon';
import timeUtils from './timeUtils';
import eventUtils from './eventUtils';

class Calendar extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    viewDate: React.PropTypes.object,
    events: React.PropTypes.array,
    view: React.PropTypes.oneOf(['month', 'week'])
  }

  static defaultProps = {
    selectedDate: new Date()
  }

  state = {
    selectedDate: this.props.selectedDate,
    viewDate: this.props.selectedDate
  }


  /*
   * Navigate forward/backward by month or week
   */

  navigate (amount) {
    const now = new Date();
    if (this.props.view === 'month') {
      const next = timeUtils.addMonths(this.state.viewDate, amount)
      if (next.getMonth() == now.getMonth()) {
        this.changeDate(now);
      } else {
        this.changeDate(next);
      }
    } else {
      const next = timeUtils.addWeeks(this.state.viewDate, amount)
      if (timeUtils.areSameWeek(now, next)) {
        this.changeDate(now);
      } else {
        this.changeDate(next);
      }
    }
  }


  /*
   * Change the date, optionally emit onChange event
   */

  changeDate (d = new Date(), silent = false) {
    const direction = d.getTime() < this.state.viewDate.getTime() ? 'left' : 'right';

    this.setState({
      selectedDate: d,
      viewDate: d,
      direction
    });

    if (this.props.onChange && !silent) this.props.onChange(d);
  }


  /*
   * Render days between start/end
   */

  _renderDays(start, end) {
    var count = timeUtils.daysBetween(end, start);
    var current = start;
    var elements = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <Day
          key={current.getTime()}
          day={current.getDate()}
          onClick={this.changeDate.bind(this, new Date(current), false)}
          selected={timeUtils.areSameDay(current, this.state.selectedDate)}
          isDifferentMonth={current.getFullYear() !== this.state.viewDate.getFullYear() || current.getMonth() !== this.state.viewDate.getMonth()}
          events={eventUtils.getEventsForDay(current, this.props.events)}
        />
      )
      current = timeUtils.addDays(current, 1);
    }
    return elements;
  }


  /*
   * Render the week view for the current viewDate
   */

  _renderWeekView () {
    const startDate = timeUtils.getFirstDayOfWeek(this.state.viewDate);
    const endDate = timeUtils.addDays(startDate, 7);
    return this._renderDays(startDate, endDate);
  }


  /*
   * Render the month view for the current viewDate
   */

  _renderMonthView () {
    const startDate = timeUtils.getFirstDayOfMonth(this.state.viewDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // first day of week
    const endDate = timeUtils.addDays(startDate, 42);
    return this._renderDays(startDate, endDate);
  }


  /*
   * Render days of the week labels
   */

  _renderDaysOfWeek () {
    var weeks = [];
    for (var i = 0; i < 7; i++) {
      weeks.push(
        <span key={i}>{ timeUtils.getShortDayOfWeek(i) }</span>
      );
    }
    return weeks;
  }

  render () {
    const animation = this.state.direction === 'left' ? 'slide-left' : 'slide-right';
    const key = this.props.view === 'month' ? this.state.viewDate.getMonth() : Math.round(timeUtils.getFirstDayOfWeek(this.state.viewDate).getDate() / 7);
    return (
      <div className={"calendar calendar--" + this.props.view}>
        <div className="header">
          <CSSTransitionGroup transitionName={animation} transitionEnterTimeout={200} transitionLeaveTimeout={200} component="div" className="date">
            <div onMouseDown={this.changeDate.bind(this, undefined, false)} key={this.state.viewDate.getMonth()}>
              <span className="month">{ timeUtils.getFullMonth(this.state.viewDate)}</span>
              <span className="year">{ this.state.viewDate.getFullYear() }</span>
            </div>
          </CSSTransitionGroup>
          <div className="previous" onMouseDown={this.navigate.bind(this, -1)}>
            <Icon icon="chevron-left"/>
          </div>
          <div className="next" onMouseDown={this.navigate.bind(this, 1)}>
            <Icon icon="chevron-right"/>
          </div>
        </div>
        <CSSTransitionGroup transitionName={animation} transitionEnterTimeout={200} transitionLeaveTimeout={200} component="div">
          <div className="calendar-slider" key={key}>
            <div className="days-of-week">{ this._renderDaysOfWeek() }</div>
            <div className="days">
              {this.props.view === 'month' ? this._renderMonthView() : this._renderWeekView()}
            </div>
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Calendar;

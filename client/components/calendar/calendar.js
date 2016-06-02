import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Month from './month';
import Week from './week';
import Icon from '../icon';
import time from './timeUtils';
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

  navigate (amount) {
    const now = new Date();
    if (this.props.view === 'month') {
      const next = time.addMonths(this.state.viewDate, amount)
      if (next.getMonth() == now.getMonth()) {
        this.changeDate(now)
      } else {
        this.changeDate(next);
      }
    } else {
      const next = time.addWeeks(this.state.viewDate, amount)
      if (time.areSameWeek(now, next)) {
        this.changeDate(now)
      } else {
        this.changeDate(next);
      }
    }
  }

  changeDate (d = new Date(), silent = false) {
    const direction = d.getTime() < this.state.viewDate.getTime() ? 'left' : 'right';

    this.setState({
      selectedDate: d,
      viewDate: d,
      direction
    });

    if (this.props.onChange && !silent) this.props.onChange(d);
  }

  _renderWeekView () {
    const events = eventUtils.getEventsForWeek(this.state.viewDate, this.props.events);
    return (
      <Week
        events={events}
        week={this.state.viewDate}
        onDayClick={this.changeDate.bind(this)}
        selectedDate={this.state.selectedDate}
        viewDate={this.state.viewDate}
      />
    );
  }

  _renderMonthView () {
    const events = eventUtils.getEventsForMonth(this.state.viewDate, this.props.events);
    return (
      <Month
        viewDate={this.state.viewDate}
        events={events}
        selectedDate={this.state.selectedDate}
        onDayClick={this.changeDate.bind(this)} />
    );
  }

  _renderDaysOfWeek () {
    var weeks = [];
    for (var i = 0; i < 7; i++) {
      weeks.push(
        <span key={i}>{ time.getShortDayOfWeek(i) }</span>
      );
    }
    return weeks;
  }

  render () {
    const animation = this.state.direction === 'left' ? 'slide-left' : 'slide-right';
    const key = this.props.view === 'month' ? this.state.viewDate.getMonth() : Math.round(time.getFirstDayOfWeek(this.state.viewDate).getDate() / 7);
    return (
      <div className={"calendar calendar--" + this.props.view}>
        <div className="header">
          <CSSTransitionGroup transitionName={animation} transitionEnterTimeout={200} transitionLeaveTimeout={200} component="div" className="date">
            <div onMouseDown={this.changeDate.bind(this, undefined, false)} key={this.state.viewDate.getMonth()}>
              <span className="month">{ time.getFullMonth(this.state.viewDate)}</span>
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
            {this.props.view === 'month' ? this._renderMonthView() : this._renderWeekView()}
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Calendar;

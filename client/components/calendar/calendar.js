import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Month from './month';
import Icon from '../icon';
import time from './timeUtils';

class Calendar extends React.Component {

  static propTypes = {
    onChange: React.PropTypes.func,
    selectedDate: React.PropTypes.object,
    viewDate: React.PropTypes.object
  }

  static defaultProps = {
    selectedDate: new Date()
  }

  state = {
    selectedDate: this.props.selectedDate,
    viewDate: this.props.selectedDate
  }

  handleDayClick = (day) => {
    this.setState({selectedDate: day});
    if (this.props.onChange) this.props.onChange(day);
  }

  incrementViewMonth = () => {
    this.setState({
      direction: 'right',
      viewDate: time.addMonths(this.state.viewDate, 1)
    });
  }

  decrementViewMonth = () => {
    this.setState({
      direction: 'left',
      viewDate: time.addMonths(this.state.viewDate, -1)
    });
  }

  renderMonths () {
    const animation = this.state.direction === 'left' ? 'slide-left' : 'slide-right';
    return (
      <CSSTransitionGroup transitionName={animation} transitionEnterTimeout={200} transitionLeaveTimeout={200} component="div">
        <Month
          key={this.state.viewDate.getMonth()}
          viewDate={this.state.viewDate}
          selectedDate={this.state.selectedDate}
          onDayClick={this.handleDayClick} />
      </CSSTransitionGroup>
    );
  }

  render () {
    const animation = this.state.direction === 'left' ? 'slide-left' : 'slide-right';
    return (
      <div className="calendar">
        <div className="header">
          <CSSTransitionGroup transitionName={animation} transitionEnterTimeout={200} transitionLeaveTimeout={200} component="div" className="date">
            <div key={this.state.viewDate.getMonth()} className="date" >
              <span className="month">{ time.getFullMonth(this.state.viewDate)}</span>
              <span className="year">{ this.state.viewDate.getFullYear() }</span>
            </div>
          </CSSTransitionGroup>
          <div className="previous" onMouseDown={this.decrementViewMonth}>
            <Icon icon="chevron-left"/>
          </div>
          <div className="next" onMouseDown={this.incrementViewMonth}>
            <Icon icon="chevron-right"/>
          </div>
        </div>
        {this.renderMonths()}
      </div>
    );
  }
}

export default Calendar;

export default {

  getDaysInMonth(d) {
    const resultDate = this.getFirstDayOfMonth(d);
    resultDate.setMonth(resultDate.getMonth() + 1);
    resultDate.setDate(resultDate.getDate() - 1);
    return resultDate.getDate();
  },

  getFirstDayOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  },

  getFirstWeekDay(d) {
    return this.getFirstDayOfMonth(d).getDay();
  },

  getFirstDayOfWeek(d) {
    const newDate = this.clone(d);
    newDate.setDate(newDate.getDate() - newDate.getDay());
    return newDate;
  },

  getTimeMode(d) {
    return d.getHours() >= 12 ? 'pm' : 'am';
  },

  getFullMonth(d) {
    const month = d.getMonth();
    switch (month) {
      default: return 'Unknown';
      case 0: return 'January';
      case 1: return 'February';
      case 2: return 'March';
      case 3: return 'April';
      case 4: return 'May';
      case 5: return 'June';
      case 6: return 'July';
      case 7: return 'August';
      case 8: return 'September';
      case 9: return 'October';
      case 10: return 'November';
      case 11: return 'December';
    }
  },

  getShortMonth(d) {
    const month = d.getMonth();
    switch (month) {
      default: return 'Unknown';
      case 0: return 'Jan';
      case 1: return 'Feb';
      case 2: return 'Mar';
      case 3: return 'Apr';
      case 4: return 'May';
      case 5: return 'Jun';
      case 6: return 'Jul';
      case 7: return 'Aug';
      case 8: return 'Sep';
      case 9: return 'Oct';
      case 10: return 'Nov';
      case 11: return 'Dec';
    }
  },

  getFullDayOfWeek(day) {
    switch (day) {
      default: return 'Unknown';
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
    }
  },

  getShortDayOfWeek(day) {
    switch (day) {
      default: return 'Unknown';
      case 0: return 'Sun';
      case 1: return 'Mon';
      case 2: return 'Tue';
      case 3: return 'Wed';
      case 4: return 'Thu';
      case 5: return 'Fri';
      case 6: return 'Sat';
    }
  },

  clone(d) {
    return new Date(d.getTime());
  },

  cloneAsDate(d) {
    const clonedDate = this.clone(d);
    clonedDate.setHours(0, 0, 0, 0);
    return clonedDate;
  },

  isDateObject(d) {
    return d instanceof Date;
  },

  addDays(d, days) {
    const newDate = this.clone(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
  },

  addWeeks(d, weeks) {
    const newDate = this.clone(d);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  },

  addMonths(d, months) {
    const newDate = this.clone(d);
    newDate.setDate(1); // first
    newDate.setMonth(d.getMonth() + months);
    return newDate;
  },

  addYears(d, years) {
    const newDate = this.clone(d);
    newDate.setFullYear(d.getFullYear() + years);
    return newDate;
  },

  setDay(d, day) {
    const newDate = this.clone(d);
    newDate.setDate(day);
    return newDate;
  },

  setMonth(d, month) {
    const newDate = this.clone(d);
    newDate.setMonth(month);
    return newDate;
  },

  setYear(d, year) {
    const newDate = this.clone(d);
    newDate.setFullYear(year);
    return newDate;
  },

  setHours(d, hours) {
    const newDate = this.clone(d);
    newDate.setHours(hours);
    return newDate;
  },

  setMinutes(d, minutes) {
    const newDate = this.clone(d);
    newDate.setMinutes(minutes);
    return newDate;
  },

  isBetween(date, a, b) {
    return date >= a && date <= b;
  },

  daysBetween(a, b) {
    return Math.floor((a - b) / 86400000);
  },

  areSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  },

  areSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  },

  areSameWeek(a, b) {
    // check within 7 days
    if (this.daysBetween(a, b) < 7) {
      a = this.clone(a);
      a.setDate(a.getDate() - a.getDay()); // first day of week
      b = this.clone(b);
      b.setDate(b.getDate() - b.getDay()); // first day of week
      return a.getDate() === b.getDate();
    }
    return false;
  },

  toggleTimeMode(d) {
    const newDate = this.clone(d);
    const hours = newDate.getHours();

    newDate.setHours(hours - (hours > 12 ? -12 : 12));
    return newDate;
  },

  formatTime(date, format) {
    let hours = date.getHours();
    let mins = date.getMinutes().toString();

    if (format === 'ampm') {
      const isAM = hours < 12;
      const additional = isAM ? ' AM' : ' PM';

      hours = hours % 12;
      hours = (hours || 12).toString();
      if (mins.length < 2) mins = `0${mins}`;

      return `${hours}:${mins}${additional}`;
    }

    hours = hours.toString();
    if (hours.length < 2) hours = `0${hours}`;
    if (mins.length < 2) mins = `0${mins}`;
    return `${hours}:${mins}`;
  },

  prettyFormatDate(date, today = new Date()) {
    let prefix = this.getFullDayOfWeek(date.getDay());
    if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
      if (date.getDate() === today.getDate()) {
        prefix = 'Today';
      } else if (date.getDate() - 1 === today.getDate()) {
        prefix = 'Tomorrow';
      }
    }

    return `${prefix} ${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).substr(2)}`;
  }
};

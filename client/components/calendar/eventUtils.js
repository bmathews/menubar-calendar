import time from './timeUtils';

module.exports = {

  getEventsForMonth(date, events) {
    var forThisMonth = events.filter((e) => {
      var d = new Date(e.start.dateTime);
      return d.getFullYear() == date.getFullYear() && d.getMonth() == date.getMonth();
    });

    return forThisMonth;
  },

  getEventsForWeek(date, events) {
    var forThisWeek = events.filter((e) => {
      var d = new Date(e.start.dateTime);
      return time.areSameWeek(d, date);
    });
    return forThisWeek;
  },

  getEventsForDay(date, events) {
    var forThisDay = events.filter((e) => {
      var d = new Date(e.start.dateTime);
      return d.getFullYear() == date.getFullYear() && d.getMonth() == date.getMonth() && d.getDate() == date.getDate();
    });
    return forThisDay;
  }

};

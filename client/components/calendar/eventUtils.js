import timeUtils from './timeUtils';

module.exports = {

  getEventsForMonth(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });
  },

  getEventsBetween(start, end, events) {
    return events.filter((e) => (
      timeUtils.isBetween(new Date(e.start.dateTime), start, end)
    ));
  },

  getEventsForWeek(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime);
      return timeUtils.areSameWeek(d, date);
    });
  },

  getEventsForDay(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
    });
  }

};

import timeUtils from './timeUtils';

module.exports = {

  getEventsForMonth(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime || e.start.date);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });
  },

  getEventsBetween(start, end, events) {
    return events.filter((e) => (
      timeUtils.isBetween(new Date(e.start.dateTime || e.start.date), start, end)
    ));
  },

  getEventsForWeek(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime || e.start.date);
      return timeUtils.areSameWeek(d, date);
    });
  },

  getEventsForDay(date, events) {
    return events.filter((e) => {
      const d = new Date(e.start.dateTime || e.start.date);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
    });
  }

};

import timeUtils from './timeUtils';

module.exports = {

  getEventsForDay(date, events) {
    return events.filter((e) => {
      if (e.start.date) {
        const start = this.getEventStartDate(e);
        const end = this.getEventEndDate(e);
        return timeUtils.isBetween(date, start, end);
      }
      const d = new Date(e.start.dateTime);
      return timeUtils.areSameDay(date, d);
    });
  },

  getDatesForEvent(e) {
    const start = this.getEventStartDate(e);
    start.setHours(0, 0, 0, 0);
    const end = this.getEventEndDate(e);
    end.setHours(0, 0, 0, 0);
    const count = timeUtils.daysBetween(end, start);

    const dates = [];
    for (let i = 0; i <= count; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    return dates;
  },

  getEventStartDate(e) {
    if (e.start.dateTime) {
      return new Date(e.start.dateTime);
    }
    const split = e.start.date.split('-');
    return new Date(split[0], split[1] - 1, split[2]);
  },

  getEventEndDate(e) {
    if (e.end.dateTime) {
      return new Date(e.end.dateTime);
    }
    const split = e.end.date.split('-');
    return new Date(split[0], split[1] - 1, split[2] - 1);
  }
};

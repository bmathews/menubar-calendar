import timeUtils from './timeUtils';

export default {

  getEventsForDay(date, events) {
    return events.filter((e) => {
      const start = this.getEventStartDate(e);
      const end = this.getEventEndDate(e);
      end.setHours(0, 0, 0, 0); // strip hours
      start.setHours(0, 0, 0, 0);
      return timeUtils.isBetween(date, start, end);
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
    // minus 1 on day, all-day events end.date is exclusive
    return new Date(split[0], split[1] - 1, split[2] - 1);
  },

  getHoursForEventOnDate(e, date) {
    const start = this.getEventStartDate(e);
    const end = this.getEventEndDate(e);
    if (e.start.date) {
      if (timeUtils.isBetween(date, start, end)) {
        return 24; // all day during this date
      }
      return 0;
    }

    if (timeUtils.areSameDay(start, date)) {
      if (!timeUtils.areSameDay(start, end)) {
        return 24 - start.getHours();
      }
      return end.getHours() - start.getHours();
    } else if (timeUtils.areSameDay(end, date)) {
      return end.getHours();
    } else if (timeUtils.isBetween(date, start, end)) {
      return 24;
    }

    return 0;
  },

  groupEventsByDate(events, today = new Date()) {
    const groups = {};

    // if no events, return only an empty today
    if (!events.length) {
      return {
        [timeUtils.prettyFormatDate(today, today)]: []
      };
    }

    let last = today;
    let todayCreated = false;
    events.forEach(e => {
      const dates = this.getDatesForEvent(e);

      dates.forEach(d => {
        const format = timeUtils.prettyFormatDate(d, today);

        // there're no events for today, so create one
        if (last < today && d > today && !todayCreated) {
          groups[timeUtils.prettyFormatDate(today, today)] = [];
          todayCreated = true;
        }

        if (!groups[format]) {
          groups[format] = [e];
        } else {
          groups[format].push(e);
        }

        last = d;
      });
    });

    return groups;
  }

};

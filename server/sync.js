var api = new (require('./CalendarAPI'))();
var store = new (require('./CalendarStore'))();
var ipc = require('ipc');
var EventEmitter = require('events')

export default class extends EventEmitter {

  setAuth (auth) {
    api.setAuth(auth);
  }

  async update () {
    try {
      console.log("Sync: Update");
      await api.syncEvents();
      console.log("Sync: Synced");

      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      var later = new Date();
      later.setDate(later.getDate() + 50);
      later.setHours(23);
      later.setMinutes(59);

      console.log("Sync: Getting all");

      var events = await store.getAll(today.toISOString(), later.toISOString());

      console.log("Sync: Update done, firing update:", events.length);

      this.emit('update', events);

    } catch (e) {
      console.error(e, e.stack);
    }

  }

  start () {
    if (this.interval) this.stop();

    console.log("Sync: Start");

    this.interval = setInterval(this.update.bind(this), 1000 * 30);
    this.update();
  }

  stop () {
    clearInterval(this.interval);
  }
}

import CalendarAPI from './api/CalendarAPI'
import CalendarStore from './CalendarStore'
const api = new CalendarAPI()
const store = new CalendarStore()

import Configstore from 'configstore'
const conf = new Configstore('menu-calendar');

import EventEmitter from 'events'

export default class extends EventEmitter {

  setAuth (auth) {
    api.setAuth(auth);
  }

  async update () {
    try {
      console.log("Sync: #update: Starting");

      let { syncTokens, items } = await api.syncEvents(conf.get('syncTokens') || {});
      conf.set('syncTokens', syncTokens)

      await store.removeItems(items.remove)
      await store.setItems(items.save)


      console.log("Sync: #update: Synced and updated store");

      var start = new Date();
      start.setHours(0);
      start.setMinutes(0);
      var end = new Date();
      end.setDate(end.getDate() + 50);
      end.setHours(23);
      end.setMinutes(59);

      console.log("Sync: #update: Now pulling all from store");

      var events = await store.getAll(start.toISOString(), end.toISOString());

      console.log("Sync: #update: Update done, firing update:", events.length);

      this.emit('update', events);

    } catch (e) {
      console.error(e, e.stack);
    }

    this.timeout = setTimeout(this.update.bind(this), 1000 * 30);

  }

  start () {
    if (this.timeout) this.stop();

    console.log("Sync: #start: Start");

    this.update();
  }

  stop () {
    clearTimeout(this.timeout);
  }
}

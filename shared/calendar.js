var Q = require('q');
var google = require('googleapis');
var gcal = google.calendar('v3');

export default class Calendar {


  /*
   * Store the auth client to use with api calls
   */

  setAuth(oauth) {
    this.oauth = oauth;
  }


  /*
   * Use the calendar api to get events
   */

  getEvents() {
    var d = new Date();

    return Q.nfcall(gcal.events.list, {
      auth: this.oauth.client,
      calendarId: 'primary',
      timeMin: d.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime'
    }).then((res) => {
      return res[0].items;
    }, (err) => {
      console.error(err);
    });
  }
}

/*
  CalendarStore.js extends EventEmitter
    Stores/fetches from localstorage
    Emits when updated
    Client listens to CalendarStore for updates
  CalendarSync.js
    Performs full sync, stores syncToken itself
    Updates CalendarStore
  Client
    Listen to and fetch from CalendarStore.js
*/

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

  getEvents(msg) {
    return Q.nfcall(gcal.events.list, {
      auth: this.oauth.client,
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime'
    }).then((res) => {
      return res[0].items;
    });
  }
}

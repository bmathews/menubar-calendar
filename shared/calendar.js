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
      // var events = res[0].items;
      // if (events.length == 0) {
      //   console.log('No upcoming events found.');
      // } else {
      //   console.log('Upcoming 10 events:');
      //   for (var i = 0; i < events.length; i++) {
      //     var event = events[i];
      //     var start = event.start.dateTime || event.start.date;
      //     console.log('%s - %s', start, event.summary, event);
      //   }
      // }
      return res[0].items;
    });
  }
}

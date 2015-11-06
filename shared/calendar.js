var Q = require('q');
var google = require('googleapis');
var gcal = google.calendar('v3');

var CalendarStore = require('./CalendarStore');
var store = new CalendarStore();

var Configstore = require('configstore');
var conf = new Configstore('menu-calendar');

// conf.set('sync-tokens', {});

export default class Calendar {


  /*
   * Store the auth client to use with api calls
   */

  setAuth(oauth) {
    this.oauth = oauth;
  }


  /*
   * Run the event sync process
   *  If we have a syncToken in storage, initial sync is done, so use it to fetch the changed items
   *  If we have a pageToken in storage, we're in the middle of a sync so grab the next page
   */

  syncEvents () {

    // fetch any sync tokens we have from storage
    var syncTokens = conf.get('sync-tokens') || {};
    var nextSyncToken = syncTokens.nextSyncToken;
    var nextPageToken = syncTokens.nextPageToken;

    var queryOpts = {
      auth: this.oauth.client,
      calendarId: 'primary',
      maxResults: 100,
      singleEvents: true
    };

    // update the queryOpts based on the tokens we have
    if (nextSyncToken) {
      queryOpts.syncToken = nextSyncToken;
    } else if (!nextPageToken) {
      var yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      queryOpts.timeMin = yearAgo.toISOString();
      yearAgo.setFullYear(yearAgo.getFullYear() + 1);
      queryOpts.timeMax = yearAgo.toISOString();
    }

    if (nextPageToken) {
      queryOpts.pageToken = nextPageToken;
    }

    // perform the request
    return Q.nfcall(gcal.events.list, queryOpts)
      .then((res) => {

        var obj = res[0];

        if (obj.nextSyncToken) {

          // we have a syncToken which means we're done for now
          syncTokens.nextSyncToken = obj.nextSyncToken;
          delete syncTokens.nextPageToken;
          conf.set('sync-tokens', syncTokens);

          console.log("Done syncing...")

          // save the items and return
          return store.setItems(obj.items)
          .then((resp) => {
            return resp;
          });

        } else if (obj.nextPageToken) {

          // we have a pageToken, keep fetching
          syncTokens.nextPageToken = obj.nextPageToken;
          conf.set('sync-tokens', syncTokens);

          console.log("Fetching next page...")

          // save the items and continue syncing
          return store.setItems(obj.items)
          .then((resp) => {
            return this.syncEvents();
          })
        }

      });
  }


  /*
   * Grab a simple list of events
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
      console.log(res);
      return res[0].items;
    }, (err) => {
      console.error(err);
    });
  }
}

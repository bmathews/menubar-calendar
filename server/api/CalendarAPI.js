import Q from 'q'
import google from 'googleapis'
const gcal = google.calendar('v3');

export default class CalendarAPI {

  static get MAX_RESULTS() { return 1000 }


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

  _getQueryOptions(syncTokens) {

    const nextSyncToken = syncTokens.nextSyncToken;
    const nextPageToken = syncTokens.nextPageToken;

    var opts = {
      auth: this.oauth.client,
      calendarId: 'primary',
      maxResults: CalendarAPI.MAX_RESULTS,
      timeZone: 'GMT',
      singleEvents: true
    }

    if (nextSyncToken) {
      opts.syncToken = nextSyncToken;
    } else if (!nextPageToken) {
      var start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0);
      start.setMinutes(0);
      var end = new Date();
      end.setDate(end.getDate() + 30);
      opts.timeMin = start.toISOString();
      opts.timeMax = end.toISOString();
    }

    if (nextPageToken) {
      opts.pageToken = nextPageToken;
    }

    return opts;
  }

  async syncEvents(syncTokens, collector={ save: [], remove: [] }) {

    console.log("CalendarAPI: #syncEvents: Starting sync")

    var queryOpts = this._getQueryOptions(syncTokens)

    let resp = await Q.nfcall(gcal.events.list, queryOpts)
    let data = resp[0]

    console.log("CalendarAPI: #syncEvents: Processing list response")

    // Group items by action
    data.items.forEach((i) => {
      if (i.status == 'cancelled') {
        collector.remove.push(i)
      } else {
        collector.save.push(i)
      }
    })

    console.log(`CalendarAPI: #syncEvents: Response: save.length = ${collector.save.length}, remove.length = ${collector.remove.length}`)

    // Fetch next page of results
    if (data.nextPageToken) {
      console.log("CalendarAPI: #syncEvents: Fetching next page");
      syncTokens.nextPageToken = data.nextPageToken;
      return await this.syncEvents(syncTokens, collector);
    }

    // Finished, so return collector
    if (data.nextSyncToken) {
      console.log("CalendarAPI: #syncEvents: Finished syncing");
      syncTokens.nextSyncToken = data.nextSyncToken;
      delete syncTokens.nextPageToken;
      return {
        syncTokens,
        items: collector
      }
    }
  }
}

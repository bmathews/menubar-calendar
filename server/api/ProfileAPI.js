var Q = require('q');
var google = require('googleapis');
var oauth = google.oauth2('v2');
var fetch = require('node-fetch');
var { stringify } = require('querystring');

export default class Profile {


  /*
   * Store the auth client to use with api calls
   */

  setAuth (oauth) {
    this.oauth = oauth;
  }


  /*
   * Use the oauth api to grab the current userinfo
   */

  getProfile () {
    return Q.nfcall(oauth.userinfo.v2.me.get, {
      auth: this.oauth.client
    }).then((res) => {
      return res[0];
    });
  }

}

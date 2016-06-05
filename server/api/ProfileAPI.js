import Q from 'q';
import google from 'googleapis';
const gauth = google.oauth2('v2');

export default class Profile {


  /*
   * Store the auth client to use with api calls
   */

  setAuth(oauth) {
    this.oauth = oauth;
  }


  /*
   * Use the oauth api to grab the current userinfo
   */

  getProfile() {
    return Q.nfcall(gauth.userinfo.v2.me.get, {
      auth: this.oauth.client
    }).then(res => res[0]);
  }

}

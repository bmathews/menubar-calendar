// Adapted from https://github.com/parro-it/electron-google-oauth

import google from 'googleapis';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
const GoogleOAuth2 = google.auth.OAuth2;

export default class OAuth2 {


  /*
   * Construct a new Google OAuth2 instance.
   *
   * @param {object} BrowserWindow - a require('browser-window') instance
   * @param {object} opts - oAuth options
   * @param {string} opts.clientId - oAuth client_id
   * @param {string} opts.clientSecret - oAuth client_secret
   * @param {array}  opts.scopes - Array of oAuth scope strings
   */

  constructor (opts) {
    this.opts = opts;
    this.client = new GoogleOAuth2(opts.clientId, opts.clientSecret, 'urn:ietf:wg:oauth:2.0:oob');
  }


  /*
   * Open a window and get the oAuth tokens.
   */

  async auth (BrowserWindow) {
    const authorizationCode = await this._getAuthorizationCode(BrowserWindow);

    const data = stringify({
      code: authorizationCode,
      client_id: this.opts.clientId,
      client_secret: this.opts.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
    });

    const res = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    const resp = await res.json();
    this.token = resp;
    this.token.created = new Date().getTime();
    this.token.expires_at = this.token.created + resp.expires_in * 1000;
    this.client.setCredentials(this.token);
    return resp;
  }


  /*
   * Refresh the token
   */

  async refresh (token) {
    const data = stringify({
      refresh_token: token ? token.refresh_token : this.token.refresh_token,
      client_id: this.opts.clientId,
      client_secret: this.opts.clientSecret,
      grant_type: 'refresh_token'
    });

    const res = await fetch('https://www.googleapis.com/o/oauth2/token', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    const resp = await res.json();
    this.token = token;
    this.token.access_token = resp.access_token;
    this.token.expires_in = resp.expires_in;
    this.token.token_type = resp.token_type;
    this.token.created = new Date().getTime();
    this.token.expires_at = this.token.created + resp.expires_in * 1000;
    this.client.setCredentials(this.token);
    return resp;
  }


  /*
   * Open a browser window and get the oAuth code.
   */

  _getAuthorizationCode (BrowserWindow) {
    return new Promise((resolve, reject) => {
      const url = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: this.opts.scopes
      });

      const win = new BrowserWindow({
        'use-content-size': true
      });

      win.loadUrl(url);

      win.on('closed', () => {
        reject(new Error('User closed the window'));
      });

      win.on('page-title-updated', () => {
        setImmediate(() => {
          const title = win.getTitle();
          if (title.startsWith('Denied')) {
            reject(new Error(title.split(/[ =]/)[2]));
            win.removeAllListeners('closed');
            win.close();
          } else if (title.startsWith('Success')) {
            resolve(title.split(/[ =]/)[2]);
            win.removeAllListeners('closed');
            win.close();
          }
        });
      });
    });
  }
}

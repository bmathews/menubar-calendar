// Adapted from https://github.com/parro-it/electron-google-oauth
import google from 'googleapis';
const GoogleOAuth2 = google.auth.OAuth2;

export default class Auth {

  /*
   * Construct a new Google OAuth2 instance.
   *
   * @param {object} BrowserWindow - a require('browser-window') instance
   * @param {object} opts - oAuth options
   * @param {string} opts.clientId - oAuth client_id
   * @param {string} opts.clientSecret - oAuth client_secret
   * @param {array}  opts.scopes - Array of oAuth scope strings
   */

  constructor(opts) {
    this.opts = opts;
    this.client = new GoogleOAuth2(opts.clientId, opts.clientSecret, 'urn:ietf:wg:oauth:2.0:oob');
  }


  /*
   * Open a window and get the oAuth tokens.
   */

  async auth(BrowserWindow) {
    console.log('ElectronGoogleAuth: #auth: Getting auth');

    const authorizationCode = await this._getAuthorizationCode(BrowserWindow);

    return new Promise((resolve) => (
      this.client.getToken(authorizationCode, (err, tokens) => {
        this.client.setCredentials(tokens);
        resolve(tokens);
      })
    ));
  }


  /*
   * Open a browser window and get the oAuth code.
   */

  _getAuthorizationCode(BrowserWindow) {
    return new Promise((resolve, reject) => {
      const url = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: this.opts.scopes
      });

      const win = new BrowserWindow({
        'use-content-size': true
      });

      win.loadURL(url);

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

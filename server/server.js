import menubar from 'menubar'
import BrowserWindow from 'browser-window'
import ipc from 'ipc'

import Configstore from 'configstore'
import secrets from '../secrets.json'

const conf = new Configstore('menu-calendar');

import ElectronGoogleAuth from '../shared/ElectronGoogleAuth'

var oauth = new ElectronGoogleAuth(Object.assign({}, secrets.oauth, {
  scopes: ["profile", "email", "https://www.googleapis.com/auth/calendar.readonly"]
}));

// conf.clear();

/*
 * Start up the menubar app
 */

var mb = menubar({
  'always-on-top': true,
  'transparent': true,
  'dir': 'client/',
  preloadWindow: true,
  height: 650,
  width: 360
});


/*
 * Gets the auth token, via either:
 *   An existing, unexpired token
 *   an expired token, which will then be refreshed
 *   A new token from a new oauth browser window
 */

var getToken = async function () {
  var token = conf.get('auth');
  if (token) {
    if (token.expires_at < new Date().getTime()) {
      var result = await oauth.refresh(token)
      conf.set("auth", result);
      return result;
    } else {
      return token;
    }
  }

  var result = await oauth.auth(BrowserWindow)
  conf.set("auth", result);
  return result;
};


/*
 * Start syncing
 */

var start = async function () {
  try {
    var token = await getToken();
    oauth.client.setCredentials(token);

    var sync = new (require('./sync'))();
    sync.setAuth(oauth);
    sync.start();

    sync.on('update', function (events) {
      if (mb.window) {
        mb.window.webContents.send('events.synced', events);
      }
    });
  } catch (e) {
    console.error(e, e.stack);
  }
};


/*
 * Listen for 'auth.get' requests and fetch token.
 * Emit an 'auth.change' event.
 */

ipc.on('auth.get', async function (event) {
  try {
    var token = await getToken()
    event.sender.send('auth.change', null, token);
  } catch (e) {
    event.sender.send('auth.change', e.stack, null);
  }
});


/*
 * Open dev tools after window is shown
 */

mb.on('after-show', function () {
  mb.window.openDevTools({ detach: true })
});


/*
 * Log when the app is ready.
 */

mb.on('ready', function () {
  start();
});

var menubar = require('menubar')
var OAuth2 = require('../shared/OAuth2')
var BrowserWindow = require('browser-window')
var ipc = require('ipc')
var Configstore = require('configstore');
var conf = new Configstore('menu-calendar');
var path = require('path');

var secrets = require('../secrets.json');

// IDEAS:
// Always store the composition message in localstorage for incremental use
// Always store recipients (maybe keep track of them)
// Snooze button
// Configure reminder time
// Simple WYSIWYG formatter (or markdown toggle or both)

var oauth = new OAuth2(Object.assign({}, secrets.oauth, {
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
  height: 600,
  width: 400
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

mb.on('after-create-window', function () {
  mb.window.openDevTools({ detach: true })
});


/*
 * Log when the app is ready.
 */

mb.on('ready', function () {
  console.log("App ready!")
});

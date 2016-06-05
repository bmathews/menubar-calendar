import menubar from 'menubar';
import { BrowserWindow, ipcMain as ipc } from 'electron';

import Configstore from 'configstore';
import secrets from '../secrets.json';
import SyncService from './SyncService';

const conf = new Configstore('menu-calendar');

import ElectronGoogleAuth from './ElectronGoogleAuth';

const oauth = new ElectronGoogleAuth(Object.assign({}, secrets.oauth, {
  scopes: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly']
}));

// conf.clear();

/*
 * Start up the menubar app
 */

const mb = menubar({
  'always-on-top': process.env.NODE_ENV === 'development',
  transparent: true,
  dir: 'client/',
  preloadWindow: true,
  height: 650,
  width: 320
});


/*
 * Gets the auth token, via either:
 *   An existing token from the conf
 *   A new token from a new oauth browser window
 */

const getToken = async () => {
  const token = conf.get('auth');
  if (token) {
    return token;
  }

  const result = await oauth.auth(BrowserWindow);
  conf.set('auth', result);
  return result;
};


/*
 * Start syncing
 */

const start = async () => {
  try {
    const token = await getToken();
    oauth.client.setCredentials(token);

    const sync = new SyncService();
    sync.setAuth(oauth);
    sync.start();

    sync.on('update', (events) => {
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

ipc.on('auth.get', async (event) => {
  try {
    const token = await getToken();
    event.sender.send('auth.change', null, token);
  } catch (e) {
    event.sender.send('auth.change', e.stack, null);
  }
});


if (process.env.NODE_ENV === 'development') {
  /*
  * Open dev tools after window is shown
  */

  mb.on('after-show', () => {
    mb.window.openDevTools({ detach: true });
  });
}


/*
 * Notify app when shown
 */

mb.on('after-show', () => {
  if (mb.window) {
    mb.window.webContents.send('app.after-show');
  }
});


/*
 * Log when the app is ready.
 */

mb.on('ready', () => {
  start();
});

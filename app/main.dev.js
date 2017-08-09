/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import storage from 'electron-json-storage';
import electronOauth2 from 'electron-oauth2';
import MenuBuilder from './menu';
// import { InshapeAPI } from './src/Utils';
import config from './src/inshape_config.json';

let mainWindow = null;

// const router = express.Router();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log());
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Move to Inshape config file?
// const config = {
//   clientId: '7sXjUlgZGrJNd8L9Xbt2asCjvodDrilKkdgBxmWrn8BTRGDPFY',
//   authorizationUrl: 'https://api.shapeways.com/oauth2/authorize',
//   tokenUrl: 'https://api.shapeways.com/oauth2/token',
//   response_type: 'token',
//   useBasicAuthorizationHeader: true,
//   redirectUri: 'http://localhost:1212/'
// };

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    title: 'Authorization',
    frame: false,
    webPreferences: {
      nodeIntegration: false
    }
  };

  const options = {
    accessType: 'Bearer'
  };

// TODO Correct the auth flow on startup
  const myApiOauth = electronOauth2(config, windowParams);

  // InshapeAPI('get', 'https://api.shapeways.com/manufacturers/v1')
  //   .then((response) => {
      // if (response.status !== 200) {
        // console.log(`Responce Status: ${response.status}`);


        // If the Storage is empty and there is no token yet
        storage.has('token', (error, hasKey) => {
          if (!hasKey) {
            myApiOauth.getAccessToken(options)
            .then((token, getError) => {
              storage.set('token', token)
              .catch((err) => {
                console.error(`Storage of access_token Error: ${err}`);
              });
              throw getError;
            });
          }
        });


        // .catch((err) => {
        //   console.error(`Aquire Refresh Token Error ${err}`);
        // });
      // } else {
      //   const reToken = storage.get('refreshToken');
      //   myApiOauth.refreshToken(reToken)
      //   .then((newToken, refreshError) => {
      //     // console.log(`refresh token: ${newToken}`);
      //     storage.set('refreshToken', newToken)
      //     .catch((err) => {
      //       console.error(`Storage of token Error: ${err}`);
      //     });
      //     throw refreshError;
      //   })
      //   .catch((err) => {
      //     console.error(`Aquire Refresh Token Error ${err}`);
      //   });
      // }
    // })
    // .catch((getErr) => {
    //   console.error(`Start up API token Error: ${getErr}`);
    // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

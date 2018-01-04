const Promise = require('pinkie-promise');
const queryString = require('querystring');
const fetch = require('node-fetch');
const objectAssign = require('object-assign');
const nodeUrl = require('url');
const electron = require('electron');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

/**
 * creates a random string to compare against when authenticating
 * @param  {Number} length length of generated string needed
 * @return {String}        Random string of characters
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
/**
 * This module take care of the authentication of the application.
 * @param  {Object} config       All the params needed for authentication
 * @param  {Object} windowParams Auth window options
 * @return {Object}              Returns the tokens nessary for authentication
 */
module.exports = function (config, windowParams) {
  function getAuthorizationCode(opts) {
    opts = opts || {};

    if (!config.redirectUri) {
      config.redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
    }

    var urlParams = {
      response_type: 'code',
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      state: generateRandomString(16)
    };

    /**
     * Adds the OAuth2 scope to the URL if there is one in the config
     * @param  {Object} opts URL options
     */
    if (opts.scope) {
      urlParams.scope = opts.scope;
    }

    /**
     * Adds the OAuth2 access type to the URL if there is one in the config
     * @param  {Object} opts URL options
     */
    if (opts.accessType) {
      urlParams.access_type = opts.accessType;
    }

    var inshapeUrl = config.inshapeUrl;
    var url = config.authorizationUrl + '?' + queryString.stringify(urlParams);

    /**
     * Opens a new BrowserWindow directing to the authentication url
     * @param  {Object} resolve callback code from url
     * @param  {Error}  reject  validation error
     */
    return new Promise(function (resolve, reject) {
      const authWindow = new BrowserWindow(windowParams || { 'use-content-size': true });
      const ses = authWindow.webContents.session;

      authWindow.loadURL(url);
      authWindow.show();
      // authWindow.webContents.openDevTools();

      authWindow.on('closed', () => {
        console.log(ses.getUserAgent());
        ses.clearStorageData([], (data) => {
          console.log(data);
        });
        reject(new Error('window was closed by user'));
      });

      /**
       * Handles the callbcak URL
       * @param  {String} url callbcak URL
       */
      function onCallback(url) {
        var url_parts = nodeUrl.parse(url, true);
        var query = url_parts.query;
        var code = query.code;
        var error = query.error;

        if (error !== undefined) {
          reject(error);
          authWindow.removeAllListeners('closed');
          authWindow.close();
        } else if (code) {
          resolve(code);
          authWindow.removeAllListeners('closed');
          authWindow.close();
        }
      }

      authWindow.webContents.on('will-navigate', (event, url) => {
        onCallback(url);
      });

      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        onCallback(newUrl);
      });
    });
  }

  /**
   * Handles formating and sending the Auth POST request
   * @param  {Object} data Holds the nessary information to send with Auth request
   * @return {Object}      Returns the request in JSON format
   */
  function tokenRequest(data) {
    const header = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (config.useBasicAuthorizationHeader) {
      header.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
    } else {
      objectAssign(data, {
        client_id: config.clientId,
        client_secret: config.clientSecret
      });
    }

    return fetch(config.tokenUrl, {
      method: 'POST',
      headers: header,
      body: queryString.stringify(data)
    }).then(res => {
      return res.json();
    });
  }

  /**
   * Retrieves the access token from the Auth server
   * @param  {Object} opts optional params
   * @return {Promise}     Returns the response from the Auth request
   */
  function getAccessToken(opts) {
    return getAuthorizationCode(opts)
      .then(authorizationCode => {
        var tokenRequestData = {
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: config.redirectUri
        };
        tokenRequestData = Object.assign(tokenRequestData, opts.additionalTokenRequestData);
        return tokenRequest(tokenRequestData);
      });
  }

  /**
   * Retrieves the refresh token from the Auth server
   * @param  {String} refreshToken Old refresh token
   * @return {Object}              Returns the response from the Auth request
   */
  function refreshToken(refreshToken) {
    return tokenRequest({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: config.redirectUri
    });
  }

  return {
    getAuthorizationCode: getAuthorizationCode,
    getAccessToken: getAccessToken,
    refreshToken: refreshToken
  };
};

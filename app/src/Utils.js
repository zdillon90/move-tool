// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';
import queryString from 'query-string';
import config from './inshape_config.json';

// Gathers the access token from storage
const accessTokenPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, hasKey) => {
    if (hasKey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        resolve(data.access_token);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

// Gathers the refresh token from storage
const refreshTokenPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, hasKey) => {
    if (hasKey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        resolve(data.refresh_token);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

/**
 * Intercepts each request to chack if it has failed because of an expired token
 * and sends the request again with the new token
 * @param response if the response comes back undefined
 * @return returns an axios request with the original InshapeAPI request
 */
axios.interceptors.response.use(undefined, (err) => {
  const res = err.response;
  if (res.status === 401) {
    return getRefreshToken()
    .then((success) => {
      if (success !== undefined) {
        const newToken = success.access_token;
        storage.get('token', (error, data) => {
          if (error) throw error;
          const token = data;
          token.access_token = newToken;
          storage.set('token', token);
        });
        err.config.__isRetryRequest = true;
        err.config.headers.authorization = `bearer ${success.access_token}`;
        return axios(err.config);
      }
    })
    .catch((error) => {
      console.error('Refresh login error: ', error);
      throw error;
    });
  }
  throw err;
});

/**
 * Uses the refreshtoken to get a new access token from Inshape and retries the
 * original request
 * @param refreshToken string refresh token gathered and sent with post request
 * @param clientId string of the app's client id
 * @return json formated data from InshapeAPI
 */
function getRefreshToken() {
  return new Promise((resolve, reject) => {
    refreshTokenPromise.then((refreshToken) => refreshToken)
    .then((token) => {
      const body = {
        grant_type: 'refresh_token',
        client_id: config.clientId,
        refresh_token: token
      };
      const refreshReq = {
        method: 'post',
        url: 'https://api.shapeways.com/oauth2/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: queryString.stringify(body)
      };
      return refreshReq;
    })
    .then((request) => {
      request.headers.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
      axios(request)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(Error(response));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
  });
}

/**
 * Main request fuction to Inshape
 * @param requestMethod string of the InshapeAPI method (GET, POST, PATCH)
 * @param endpoint string of the InshapeAPI endpoint
 * @param body object of a PATCH request if the request is patching data
 */
export function InshapeAPI(requestMethod, endpoint, body) {
  return new Promise((resolve, reject) => {
    accessTokenPromise.then((data) => data)
    .then((accessToken) => {
      const req = {
        method: requestMethod,
        url: endpoint,
        headers: {
          authorization: `bearer ${accessToken}`
        }
      };

      if (requestMethod === 'patch') {
        req.data = body;
      }

      axios(req)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(Error(response));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }).catch((err) => console.error(err));
  });
}

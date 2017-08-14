// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';
import queryString from 'query-string';
import config from './inshape_config.json';


const accessTokenPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, hasKey) => {
    if (hasKey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        console.log(`Promise Access Token: ${data.access_token}`);
        resolve(data.access_token);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

const refreshTokenPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, hasKey) => {
    if (hasKey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        console.log(`Promise Refresh Token: ${data.refresh_token}`);
        resolve(data.refresh_token);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

axios.interceptors.response.use(undefined, (err) => {
  console.log('intercepting!!!');
  console.log(err.config);
  let res = err.response;
  // TODO Add a condition to chek to see if the reason was bearer experation
  if (res.status === 400 && res.config && !res.config.__isRetryRequest) {
    return getRefreshToken()
    .then((success) => {
      if (success !== undefined) {
        console.log('Success:');
        console.log(success);
        const newToken = success.access_token;
        storage.get('token', (error, data) => {
          if (error) throw error;
          const token = data;
          token.access_token = newToken;
        });
        // This writes over the entire token with no refresh!
        // Figure out how to store the new token but to keep the old refresh_token.
        err.config.__isRetryRequest = true;
        err.config.headers.authorization = `bearer ${success.access_token}`;
        console.log('new token set');
        console.log(err);
        // TODO fix the following axios call to redo the last request
        return axios(err.config);
      }
    })
    .catch((error) => {
      console.log('Refresh login error: ', error);
      throw error;
    });
  }
  throw err;
});

function getRefreshToken() {
  return new Promise((resolve, reject) => {
    refreshTokenPromise.then((refreshToken) => refreshToken)
    .then((token) => {
      console.log(`refresh token: ${token}`);
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
      console.log('Trying to get new token');
      request.headers.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
      // TODO that refresh token is only given out once, I need to grab it form storage
      axios(request)
        .then((response) => {
          console.log(response);
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

      console.log('Inshape Call');
      console.log(accessToken);
      axios(req)
        .then((response) => {
          console.log(response);
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

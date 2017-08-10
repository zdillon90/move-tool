// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';
import config from './inshape_config.json';

const tokenPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, hasKey) => {
    if (hasKey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

const refreshPromise = new Promise((resolve, reject) => {
  storage.has('token', (error, haskey) => {
    if (haskey) {
      storage.get('token', (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    } else {
      reject(Error(`Storage Error: ${error}`))
    }
  });
});

function getRefreshToken() {
  // console.log(tokenPromise);
  // console.log(tokenPromise.then((data) => data));
  return new Promise((resolve, reject) => {
    refreshPromise.then((data) => {
      console.log(data);
      return data;
    })
      .then((token) => {
        const refreshReq = {
          method: 'post',
          url: 'https://api.shapeways.com/oauth2/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          },
          grant_type: 'refresh_token',
          response_type: 'token',
          client_id: config.clientId,
          refresh_token: token.refresh_token
        };
        console.log('Trying to get new token');
        return axios(refreshReq);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

axios.interceptors.response.use(undefined, (err) => {
  console.log('intercepting!!!');
  console.log(err.response);
  if (err.response.status === 400) {
    getRefreshToken()
    .then((success) => {
      storage.set('token', success);
      console.log('new token set');
      return axios(err.config);
    })
    .catch((error) => {
      console.log('Refresh login error: ', error);
      throw error;
    });
  } else {
    console.log('Did not catch error');
  }
});

export function InshapeAPI(requestMethod, endpoint, body) {
  return new Promise((resolve, reject) => {
    tokenPromise.then((data) => data)
    .then((token) => {
      const req = {
        method: requestMethod,
        url: endpoint,
        headers: {
          authorization: `bearer ${token.access_token}`
        }
      };

      if (requestMethod === 'patch') {
        req.data = body;
      }

      console.log('Inshape Call');
      axios(req)
        .then((response) => {
          console.log(response);
          return resolve(response.data);
        })
        .catch((err) => {
          console.error(err);
          reject(Error(err.statusText));
        });
    }).catch((err) => console.error(err));
  });
}

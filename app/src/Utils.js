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

function getRefreshToken(token) {
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
}

axios.interceptors.response.use(undefined, (err) => {
  console.log('intercepting!!!');
  console.log(`*${err}*`);
  if (err.status === 404) {
    return getRefreshToken()
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
          resolve(response.data);
        })
        .catch((err) => {
          console.error(err);
          reject(Error(err.statusText));
          // // TODO Put the refresh token logic here!
          // console.log('Going to use the refresh token');
          // axios(refreshReq)
          //   .then((refreshResponce) => {
          //     storage.set('token', refreshResponce);
          //     console.log('Used refresh token');
          //     return refreshResponce
          //   })
          //   .then((refreshResponce) => {
          //     req.headers = {
          //       authorization: `bearer ${refreshResponce.access_token}`
          //     }
          //     axios(req)
          //       .then((res) => res.data)
          //       .catch((err) => console.error(err));
          //   })
          //   .catch((err) => console.error(err));

          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          // console.log(response.statusText);
          // reject(Error(response.statusText));
        });
    }).catch((err) => console.error(err));
  });
}

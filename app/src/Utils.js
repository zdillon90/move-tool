// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';
import queryString from 'query-string';
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

axios.interceptors.response.use(undefined, (err) => {
  console.log('intercepting!!!');
  console.log(err.config);
  let res = err.response;
  // TODO Add a condition to chek to see if the reason was bearer experation
  if (res.status === 400 && res.config && !res.config.__isRetryRequest) {
    return getRefreshToken(err.config)
    .then((success) => {
      if (success !== undefined) {
        console.log(`Success: ${success}`);
        storage.set('token', success);
        err.config.__isRetryRequest = true;
        err.config.headers.Authorization = `Bearer ${success.data}`;
        console.log('new token set');
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

function getRefreshToken(data) {
  return new Promise((resolve, reject) => {
    console.log(data.headers.refresh);
    const body = {
      grant_type: 'refresh_token',
      client_id: config.clientId,
      refresh_token: data.headers.refresh
    };
    const refreshReq = {
      method: 'post',
      url: 'https://api.shapeways.com/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: queryString.stringify(body)
    };
    console.log('Trying to get new token');
    refreshReq.headers.Authorization = 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64');
    // TODO that refresh token is only given out once, I need to grab it form storage
    axios(refreshReq)
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
  });
}

export function InshapeAPI(requestMethod, endpoint, body) {
  return new Promise((resolve, reject) => {
    tokenPromise.then((data) => data)
    .then((token) => {
      const req = {
        method: requestMethod,
        url: endpoint,
        headers: {
          authorization: `bearer ${token.access_token}`,
          refresh: token.refresh_token
        }
      };

      if (requestMethod === 'patch') {
        req.data = body;
      }

      console.log('Inshape Call');
      console.log(token);
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

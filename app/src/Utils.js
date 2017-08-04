// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';

const tokenPromise = new Promise((resolve, reject) => {
  storage.has('accessToken', (error, hasKey) => {
    if (hasKey) {
      storage.get('accessToken', (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    } else {
      reject(Error(`Storage Error: ${error}`));
    }
  });
});

export function InshapeAPI(requestMethod, endpoint, body) {
  return new Promise((resolve, reject) => {
    tokenPromise.then((data) => data)
    .then((token) => {
      const req = {
        method: requestMethod,
        url: endpoint,
        headers: {
          authorization: `bearer ${token}`
        }
      };
      if (requestMethod === 'patch') {
        req.body = body;
      }
      axios(req)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // Resolve the promise with the response text
          resolve(response.data);
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          console.log(response.statusText);
          reject(Error(response.statusText));
        }
      })
      .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  });
}

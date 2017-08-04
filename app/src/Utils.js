// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';

// export function InshapeAPI(requestMethod, endpoint) {
//   console.log('Here in the Inshape API function');
//   const tokenPromise = new Promise((resolve, reject) => {
//     storage.has('accessToken', (error, hasKey) => {
//       if (hasKey) {
//         console.log('Key has been had');
//         storage.get('accessToken', (accessError, data) => {
//           if (error) {
//             throw error;
//           }
//           console.log(data);
//           const req = { method: requestMethod,
//             // url: 'https://api.shapeways.com/manufacturers/v1',
//             url: endpoint,
//             headers:
//             { authorization: `bearer ${data}` }
//           };
//           axios(req)
//           .then((response) => {
//             console.log(response);
//             resolve(response);
//             return response;
//           })
//           .catch((err) => console.log(err));
//         });
//       } else {
//         reject(Error(`It broke: ${error}`));
//       }
//     });
//   });
//
//   tokenPromise.then((result) => {
//     console.log(`tokenPromise Result: ${result}`);
//     return result;
//   }).catch((promError) => console.log(promError));
// }

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

export function InshapeAPI(requestMethod, endpoint) {
  console.log('Inside InshapeAPI function');
  return new Promise((resolve, reject) => {
    tokenPromise.then((data) => data)
    .then((token) => {
      console.log(`Request token ${token}`);
      const req = {
        method: requestMethod,
        url: endpoint,
        headers: {
          authorization: `bearer ${token}`
        }
      };
      axios(req)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log('made it');
          // Resolve the promise with the response text
          resolve(response.data);
        } else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(response.statusText));
        }
      })
      .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  });
}


// axios(req)
// .then((response) => {
//   console.log(response);
//   if (response.status === 200) {
//     // Resolve the promise with the response text
//     resolve(response.data);
//   } else {
//     // Otherwise reject with the status text
//     // which will hopefully be a meaningful error
//     reject(Error(response.statusText));
//   }
// })
// .catch((err) => console.log(err));


// console.log(`Request token ${data}`);
// const req = {
//   method: requestMethod,
//   url: endpoint,
//   headers: {
//     authorization: `bearer ${data}`
//   }
// };

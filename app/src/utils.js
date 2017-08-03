// Placeholder for the Inshape API endpoints
import storage from 'electron-json-storage';
import axios from 'axios';

export default function inshapeAPI(endpoint) {
  storage.get('accessToken', (error, data) => {
    if (error) {
      throw error;
    }
    console.log(data);
    const req = { method: 'get',
      // url: 'https://api.shapeways.com/manufacturers/v1',
      url: endpoint,
      headers:
      { authorization: `bearer ${data}` }
    };
    axios(req)
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ authorized: true });
      }
      return response.data;
    })
    .catch((err) => console.log(err));
  });
}

import React, { Component } from 'react';
import Cookie from 'js-cookie';
import request from 'request';
import Manufacturers from './components/Manufacturers';
import Navbarz from './components/Navbarz';
import SubTableBody from './components/SubTableBody';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
    this.fetchStatuses = this.fetchStatuses.bind(this);
    this.fetchProductionOrders = this.fetchProductionOrders.bind(this);
    this.defaultCheck = this.defaultCheck.bind(this);
    this.setProcessName = this.setProcessName.bind(this);
    this.patchPos = this.patchPos.bind(this);
    this.state = {
      authorized: null,
      authLink: null,
      allManufacturers: [],
      manufacturer: '',
      manufacturerId: null,
      processes: [],
      process: null,
      pos: null,
      patchResult: ''
    };
  }

  // TODO Add check for Auth component to check if the Auth Key is in a cookie

  // Authentication of the App and the user
  componentDidMount() {
    const clientId = '7sXjUlgZGrJNd8L9Xbt2asCjvodDrilKkdgBxmWrn8BTRGDPFY';
    const callbackURL = 'http://localhost:1212';
    const currentURL = window.location.href;
    console.log(currentURL);
    const currentParms = this.parseURLParms(currentURL);
    console.log(currentParms);
    if (currentParms === undefined) {
      const baseURL = 'https://api.shapeways.com/oauth2/authorize?response_type=token&client_id=';
      const url = `${baseURL} ${clientId} &redirect_uri= ${callbackURL}`;
      console.log(url);
      this.setState({
        authLink: url
      })
    } else {
      const accessToken = currentParms.access_token[0];
      Cookie.set('accessToken', accessToken)
      this.setState({authorized: true}, this.getManufacturers)
    }
  }

  parseURLParms(url) {
    let queryStart = url.indexOf("#") + 1,
        queryEnd = url.indexOf("?") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, n, v, nv;

    if (query === url || query === "") return;

    for (let i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);

      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
  }

  getManufacturers() {
    let token = Cookie.get('accessToken')
    console.log("token: " + token);
    let options = {
      url: 'https://api.shapeways.com//models/v1',
      headers: {
        'Authorization': "bearer " + token
      }
    };

    function callback(error, response, body) {
      console.log(error);
      console.log(response);
      console.log(body);
    }

    request(options, callback);
    // fetch('https://api.shapeways.com/manufacturers/v1', myInit)
    //   .then( response => response.json() )
    //   .then( ({manufacturers: allManufacturers}) => this.setState({allManufacturers}));
  }

  fetchStatuses() {
    let id = this.state.manufacturerId;
    const manufacturerUrl  = '/manufacturer/' + id;
    fetch(manufacturerUrl)
      .then( response => response.json() )
      .then( ({productionProcesses: processes}) =>
        this.setState({processes}, this.defaultCheck));
  }

  handleManufacturerChange(man_name, man_id) {
    this.setState(
      {
        manufacturer: man_name,
        manufacturerId: man_id
      },
      this.fetchStatuses
    );
  }

  setProcessName(target) {
    this.state.processes.forEach(function(list) {
      if (list.name === target.name) {
        this.setState({
          process: list
        }, this.fetchProductionOrders);
      }
    }, this);
  }

  fetchProductionOrders() {
    let id = this.state.manufacturerId;
    let process = this.state.process;
    let processSteps = process.processSteps;
    let subStatusIds = []
    processSteps.forEach(function(list) {
      subStatusIds.push(list.id);
    });
    let IdsString = subStatusIds.toString();
    const poURL = '/production_orders/manufacturer=' + id + '/sub_statuses=' + IdsString;
    fetch(poURL)
      .then ( response => response.json() )
      .then ( ({productionOrders: pos}) =>
        this.setState({pos}));
  }


  defaultCheck() {
    let currentProcesses = this.state.processes
    const defaultName = {name: "default"}
    if (currentProcesses.length === 1) {
      this.setProcessName(defaultName);
    }
  }

  handleProcessChange(target) {
    this.setProcessName(target);
  }

  patchPos(poPatchList) {
    fetch('/update_production_orders', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poPatchList)
    })
    .then ( response => response.json() )
    .then(function(jsonResponse) {
      this.setState({patchResult: jsonResponse.result}, this.defaultCheck);

      // If we have an error to display, reset after 3 seconds
      if (jsonResponse.result !== "") {
        this.setStateWithTimeout('patchResult', '', 3000);
      }
    }.bind(this))

  }

  setStateWithTimeout(key, value, time) {
    return setTimeout(function() {
        var newState = {};
        newState[key] = value;
        this.setState(newState);
    }.bind(this), time);
  }

  // TODO Add in proper Loading screen
  loadingPos() {
    const currentProcess = this.state.process;
    const pos = this.state.pos;
    if (pos) {
      return (
        <SubTableBody
          list={currentProcess}
          pos={pos}
          patchPos={this.patchPos}
        />
      );
    } else {
      return (
        <h1>Loading...</h1>
      );
    }
  }

  render() {
    const manList = this.state.allManufacturers;
    const manufacturer = this.state.manufacturer;
    const processes = this.state.processes;
    const currentProcess = this.state.process;
    const result = this.state.patchResult;
    const authLink = this.state.authLink;
    const authorized = this.state.authorized;
    return (
      <div>
        <Navbarz
          manufacturer={manufacturer}
          process={currentProcess}
          result={result}
          authorized={authorized}
        />
        {currentProcess ? (
          this.loadingPos()
        ) : (
          <Manufacturers
            list={manList}
            onManufacturerChange={this.handleManufacturerChange}
            processes={processes}
            onProcessChange={this.handleProcessChange}
            authLink={authLink}
          />
        )}
      </div>
    );
  }
}

export default App;

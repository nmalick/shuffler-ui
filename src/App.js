import React from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './Welcome';

import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import * as $ from "jquery";
import hash from "./hash";


class App extends React.Component {
  constructor(){
    super();
    this.state = {
      token: null
    };
  }
  componentDidMount(){
    let _token = hash.access_token;

    if (_token) {
      this.setState({
        token: _token
      });
    }
  }

  componentWillUnmount() {
  }

  render(){
    return (
        <div className="App">
          {!this.state.token && (
            <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
              Login to spotify
            </a>
          )}
          {this.state.token && (
            <Welcome name="Test"/>
          )}
        </div>
    )
  }
}

export default App;

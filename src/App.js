import React from "react";
import "./App.css";
import Welcome from "./Welcome";
import shufflerLogo from "./images/shufflerNew - circle-cropped.png";
import * as $ from "jquery";
import hash from "./hash";
import {
  authEndpoint,
  clientId,
  redirectUri,
  scopes,
  tokenEndpoint,
  grantType,
  clientSecret,
  herokuEndpoint,
  userEndpoint,
  playlistEndpoint
} from "./config";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token: null,
      tokenType: null,
      expiresIn: null,
      userName: null,
      listOfPlaylists: null,
      numOfPlaylists: null
      // code: null,
      // error: null,
      // _state: null,
      // scope: null,
      // refreshToken: null,
      // spotifyLoginPage: null
    };
    this.getUserData = this.getUserData.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
  }
  componentDidMount() {
    let _token = hash.access_token;
    let _tokenType = hash.token_type;
    let _expires_in = hash.expires_in;
    console.log("hash", hash);

    if (_token) {
      this.setState({
        token: _token,
        tokenType: _tokenType,
        expiresIn: _expires_in
      });
    }
  }

  componentDidUpdate() {
    if (!this.state.userName) {
      this.getUserData(this.state.token);
    }

    if (!this.state.numOfPlaylists) {
      this.getUserPlaylists(this.state.token);
    }
  }

  componentWillUnmount() {}

  getUserData(token) {
    $.ajax({
      url: `${userEndpoint}`,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log("data", data);
        this.setState({
          userName: data.display_name
        });
      }
    });
  }

  getUserPlaylists(token) {
    $.ajax({
      url: `${playlistEndpoint}`,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log("data", data);
        this.setState({
          listOfPlaylists: data.items,
          numOfPlaylists: data.total
        });
      }
    });
  }

  render() {
    if (!this.state.token) {
      return (
        <div className="App">
          <div className="container ">
            <p></p>
            <p></p>
            <img className="lead" src={shufflerLogo} />
            <p></p>
            <p></p>
            <h1 className="display-4 headerText">Welcome to the Shuffler</h1>
            <p></p>
            <p></p>
            <a
              className="btn btn-success btn-lg login-button"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          </div>
        </div>
      );
    }
    if (this.state.token) {
      return (
        <Welcome
          token={this.state.token}
          userName={this.state.userName}
          numOfPlaylists={this.state.numOfPlaylists}
          listOfPlaylists={this.state.listOfPlaylists}
        />
      );
    }
  }
}

export default App;

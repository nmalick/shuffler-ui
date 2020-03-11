import React from "react";
import "./Playlist.css";
import Navbar from "./Navbar";
import * as $ from "jquery";
import { playlistDataEndpoint } from "./config";
import axios from 'axios';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      selectedPlaylistId: null,
      playlistName: null,
      tracks: null,
      tracksReceived: null
    };
    this.getTracks = this.getTracks.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      this.setState({ token: this.props.token });
    }
  }

  componentDidUpdate() {
    if (this.state.token && !this.state.tracksReceived) {
      this.getTracks(this.state.token, this.props.selectedPlaylistId);
    }
  }

  componentWillUnmount() {}

  getTracks(token, playlistId) {
    $.ajax({
      url: `${playlistDataEndpoint}` + `${this.props.selectedPlaylistId}`,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log("tracks", data.tracks);
        this.setState({
          playlistName: data.name,
          tracksReceived: true,
          tracks: data.tracks.items.map(track => (
            <tr>
              <td scope="row">
                {track.track.preview_url && (
                  <a
                    className="btn btn-dark previewButton"
                    href={track.track.preview_url}
                    target="_blank"
                  >
                    Preview Song
                  </a>
                )}
              </td>
              <th>{track.track.name}</th>
              <td>{track.track.artists[0].name}</td>
            </tr>
          ))
        });
      }
    });
  }

  startAnalysis(){
    const newSong = {
      shufflerDB_songName: "Song #2",
      shufflerDB_artistName: "Artist B",
      shufflerDB_songGenre: "Genre X",
      shufflerDB_songAnalyzed: false
    };
    axios.post('http://localhost:4000/shuffler/add', newSong)
    .then(res => console.log(res.data));
  }

  render() {
    return (
      <div className="Playlist">
        <Navbar />
        <div className="jumbotron jumbotron-fluid bg-light">
          <div className="container">
            <img
              src={this.props.selectedPlaylistImg}
              class="img-thumbnail rounded"
              width="300vem"
              height="500vem"
            />
            <p></p>
            <button className="btn btn-lg btn-dark shuffleButton" 
            onClick={this.startAnalysis}
            >
              Analyze Playlist
            </button>
            <p></p>
            <div class="table-responsive">
              <table class="table">
                <thead class="tableHeader">
                  <tr>
                    <th scope="col">Songs in: {this.state.playlistName}</th>
                  </tr>
                </thead>
                <tbody>
                  <ul>{this.state.tracks}</ul>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Playlist;

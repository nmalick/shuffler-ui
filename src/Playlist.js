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
      listOfTracks: null,
      tracksReceived: null
    };
    this.getTracks = this.getTracks.bind(this);
    this.startAnalysis = this.startAnalysis.bind(this);
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
          listOfTracks: data.tracks.items,
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
    if (this.state.token && this.state.tracksReceived){
      let song1 = this.state.listOfTracks[0];
      let song2 = this.state.listOfTracks[1];
      const playlistToAdd = {
        "newPlaylist": {
          "playlistName":"Playlist Name",
          "songsInPlaylist": [
            {
                "songName": song1.track.name,
                "artists": [
                  {
                      "href": "test",
                      "id": "test",
                      "name": "ARTIST #1"
                  }
              ],
                "bars": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36.9
                },
                "beats": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36
                },
                "sections": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36,
                    "loudness": 36,
                    "tempo": 36,
                    "tempo_confidence": 36,
                    "key": 36,
                    "key_confidence": 36,
                    "mode": 36,
                    "mode_confidence": 36,
                    "time_signature": 36,
                    "time_signature_confidence": 36
                },
                "segments": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36,
                    "loudness_start": 36,
                    "loudness_max_time": 36,
                    "loudness_max": 36,
                    "loudness_end": 36,
                    "pitches": [
                        36,
                        36,
                        36
                    ],
                    "timbre": [
                        36,
                        36,
                        36,
                        36
                    ]
                },
                "songPopularity": 36.9,
                "duration": 36,
                "key": 36,
                "mode": 36,
                "acousticness": 36,
                "danceability": 36,
                "energy": 36,
                "loudness": 36,
                "valence": 36,
                "tempo": 36,
                "genres": [
                    "test1",
                    "test2"
                ],
                "artistPopularity": 36
            },
            {
                "songName": song2.track.name,
                "artists": [
                  {
                      "href": "test",
                      "id": "test",
                      "name": "ARTIST #2"
                  },
                  {
                      "href": "test",
                      "id": "test",
                      "name": "ARTIST #2 FEAT"
                  }
              ],
                "bars": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36.9
                },
                "beats": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36
                },
                "sections": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36,
                    "loudness": 36,
                    "tempo": 36,
                    "tempo_confidence": 36,
                    "key": 36,
                    "key_confidence": 36,
                    "mode": 36,
                    "mode_confidence": 36,
                    "time_signature": 36,
                    "time_signature_confidence": 36
                },
                "segments": {
                    "start": 36,
                    "duration": 36,
                    "confidence": 36,
                    "loudness_start": 36,
                    "loudness_max_time": 36,
                    "loudness_max": 36,
                    "loudness_end": 36,
                    "pitches": [
                        36,
                        36,
                        36
                    ],
                    "timbre": [
                        36,
                        36,
                        36,
                        36
                    ]
                },
                "songPopularity": 36.9,
                "duration": 36,
                "key": 36,
                "mode": 36,
                "acousticness": 36,
                "danceability": 36,
                "energy": 36,
                "loudness": 36,
                "valence": 36,
                "tempo": 36,
                "genres": [
                    "test1",
                    "test2"
                ],
                "artistPopularity": 36
            }
        ]
        }
      };

    axios.post('http://localhost:4000/shuffler/add', playlistToAdd)
    .then(res => console.log(res.data));
    }
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

import React from "react";
import "./Playlist.css";
import Navbar from "./Navbar";
import * as $ from "jquery";
import { playlistDataEndpoint } from "./config";
import { trackAudioAnalysisEndpoint } from "./config";
import { trackAudioFeaturesEndpoint } from "./config";
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
      tracksReceived: null,
      trackAudioAnalysis: null,
      trackAudioFeatures: null
    };
    this.getTracks = this.getTracks.bind(this);
    this.startAnalysis = this.startAnalysis.bind(this);
    this.getTrackAudioAnalysis = this.getTrackAudioAnalysis.bind(this);
    this.getTrackAudioFeatures = this.getTrackAudioFeatures.bind(this);
    this.addSongToDb = this.addSongToDb.bind(this);
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

  componentWillUnmount() { }

  addSongToDb(songToAdd){
    
    const newSong = {
      "songToAdd": songToAdd
    };
    
    console.log("newSong", newSong);
    axios.post('http://localhost:4000/shuffler/add', newSong )
      .then(res => console.log(res.data));
  }

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

  getTrackAudioAnalysis(token, trackID) {
    return $.ajax({
      url: `${trackAudioAnalysisEndpoint}` + trackID,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log("trackAudioAnalysis", data);
        this.setState({
          trackAudioAnalysis: data
        });
      }
    });
  }

  getTrackAudioFeatures(token, trackID) {
    return $.ajax({
      url: `${trackAudioFeaturesEndpoint}` + trackID,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        console.log("trackAudioFeatures", data);
        this.setState({
          trackAudioFeatures: data
        });
      }
    });
  }

  async startAnalysis() {
    if (this.state.token && this.state.tracksReceived && this.state.listOfTracks) {
      var listOfTracks = this.state.listOfTracks;
      var songToAdd;
      for (var i = 0; i <listOfTracks.length ; i++) {

        var trackAudioAnalysis = await this.getTrackAudioAnalysis(this.state.token, listOfTracks[i].track.id)
        var trackAudioFeatures =  await this.getTrackAudioFeatures(this.state.token, listOfTracks[i].track.id)

        if (trackAudioAnalysis && trackAudioFeatures) {
          
          var songToAdd = {
            newSong: listOfTracks[i].track.name,
            trackID: listOfTracks[i].track.id,
            playlists: {
              playlistName: this.state.playlistName,
              playlistId: this.props.selectedPlaylistId
            },
            artists: listOfTracks[i].track.artists,
            songPopularity: listOfTracks[i].track.popularity,

            bars: trackAudioAnalysis.bars,
            beats: trackAudioAnalysis.beats,
            sections: trackAudioAnalysis.sections,
            segments: trackAudioAnalysis.segments,

            duration: trackAudioFeatures.duration_ms,
            key: trackAudioFeatures.key,
            mode: trackAudioFeatures.mode,
            acousticness: trackAudioFeatures.acousticness,
            danceability: trackAudioFeatures.danceability,
            energy: trackAudioFeatures.energy,
            loudness: trackAudioFeatures.loudness,
            valence: trackAudioFeatures.valence,
            tempo: trackAudioFeatures.tempo
          };
        }

        this.addSongToDb(songToAdd);
      }
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

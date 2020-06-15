import React from "react";
import "./Playlist.css";
import Navbar from "./Navbar";
import * as $ from "jquery";
import Clusters from "./Clusters";
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
      trackAudioFeatures: null,
      songsFromDB: null,
      songClusters: null
    };
    this.getTracks = this.getTracks.bind(this);
    this.startAnalysis = this.startAnalysis.bind(this);
    this.getTrackAudioAnalysis = this.getTrackAudioAnalysis.bind(this);
    this.getTrackAudioFeatures = this.getTrackAudioFeatures.bind(this);
    this.addSongToDb = this.addSongToDb.bind(this);
    this.runClusterAlg = this.runClusterAlg.bind(this);
    this.getArtistNames = this.getArtistNames.bind(this);
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
            playlists: Object.values({
              playlistObject: {
                playlistName: this.state.playlistName,
                playlistId: this.props.selectedPlaylistId
              }          
            }),
            artists: await this.getArtistNames(listOfTracks[i].track.artists),
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

          this.addSongToDb(songToAdd);
      }

    }

      this.runClusterAlg();
      
    }
  }



  //React Setup Functions
  componentDidMount() {
    if (this.props.token) {
      this.setState({ token: this.props.token });
    }
  }

  componentDidUpdate() {
    if (this.state.token && !this.state.tracksReceived) {
      this.getTracks(this.state.token, this.props.selectedPlaylistId);
    }

    if(this.state.songClusters){
      console.log("nsc", this.state.songClusters);
    }
  }

  componentWillUnmount() { }

//Spotify Ajax functions
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

  //Data Clean Up Functions
  getArtistNames(artistsArray){
    var artistNames = new Array(); 
    for(var i = 0; i <artistsArray.length ; i++) {
          artistNames[i] = artistsArray[i].name;
      }

      return artistNames;
  }

  //DB functions
  async addSongToDb(songToAdd){
    const newSong = {
      "songToAdd": songToAdd
    };
    console.log("newSong", newSong);

    var songInDb;
    await axios.get('http://localhost:4000/shuffler/findbyTrackId/'+songToAdd.trackID).then(res => {
      songInDb = Object.values(res.data);
      console.log("songInDb", songInDb);
    });

    if(songInDb.length == 0){
      console.log("Adding new song");
      await axios.post('http://localhost:4000/shuffler/add', newSong )
      .then(res => console.log(res.data));
    }else{
      var playlistObjects = songInDb[0].songToAdd.playlists;
      var newPlaylistId = newSong.songToAdd.playlists[0].playlistId;
      console.log("playlistObjects", playlistObjects);
      console.log("newPlaylistId", newPlaylistId);

      for (var i=0; i<playlistObjects.length;i++){
        if(playlistObjects[i].playlistId == newPlaylistId){
          console.log(" playlistID found");
            break;
        }
        else if(playlistObjects[i].playlistId != newPlaylistId && i == playlistObjects.length-1){
          console.log("last playlist ID reached");
          await axios.post('http://localhost:4000/shuffler/updatePlaylistsByTrackId/'+songToAdd.trackID , newSong.songToAdd.playlists[0])
          .then(res => console.log(res.data));
        }
      }
  
    }

    
  }


//Data Analysis functions
  async runClusterAlg(){
    await axios.get('http://localhost:4000/shuffler').then(res => {
    
    this.setState({songsFromDB : Object.values(res.data)});
    });
    
    console.log("sfd", this.state.songsFromDB);

    
    var dataArray = new Array();
    for(var i=0; i<this.state.songsFromDB.length;i++){
      var dataItem = new Array();
      for(var j=0;j<10;j++){
        switch  (j){
          case 0:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.songPopularity;
          break;
          case 1:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.duration;
          break;
          case 2:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.key;
          break;
          case 3:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.mode;
          break;
          case 4:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.acousticness;
          break;
          case 5:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.danceability;
          break;
          case 6:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.energy;
          break;
          case 7:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.loudness;
          break;
          case 8:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.valence;
          break;
          case 9:
          dataItem[j]= this.state.songsFromDB[i].songToAdd.tempo;
        }
      }
      dataArray[i] =dataItem;
    }
    console.log(dataArray);

    var clustering = require('density-clustering');
    var kmeans = new clustering.KMEANS();
    var newClusters = kmeans.run(dataArray, Math.round(Math.sqrt(this.state.songsFromDB.length)));
    console.log("newClusters", newClusters);

    var newSongClusters = new Array();
    for(var k=0; k<newClusters.length;k++){
      var newClusterElement = new Array();
      for(var l=0; l<newClusters[k].length;l++){
        var index = newClusters[k][l];
        newClusterElement[l] = this.state.songsFromDB[index]._id;
      }
      newSongClusters[k] = newClusterElement;
    }
    
    console.log("newSongClusters", newSongClusters);
    
    this.setState({
      songClusters: newSongClusters
    });
    
    //Clustering works but I don't get the array index so I can't differentiate values. Adding a name or number messes it up
    // var clusterMaker = require('clusters');
    // clusterMaker.k(3);
    // clusterMaker.iterations(100);
    // clusterMaker.data(dataArray);    
    // console.log("clusters", clusterMaker.clusters());


  }



  render() {
    
    if(!this.state.songClusters){
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
    
    if(this.state.songClusters){
      return(
        <Clusters
          token={this.state.token}
          userName={this.state.userName}
          songClusters={this.state.songClusters}
        />
      )
    }

    
  }
}

export default Playlist;

import React from "react";
import "./Welcome.css";
import Navbar from "./Navbar";
import Playlist from "./Playlist";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      playlists: null,
      selectedPlaylistId: null,
      selectedPlaylistImg: null
    };
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      this.setState({ token: this.props.token });
    }
  }

  componentDidUpdate() {
    if (this.props.numOfPlaylists) {
      console.log("numOfPlaylists", this.props.numOfPlaylists);
      console.log("listOfPlaylists", this.props.listOfPlaylists);
      if (!this.state.playlists) {
        this.setState({
          playlists: this.props.listOfPlaylists.map(playlist => (
            <div className="card mb-3 text-center">
              <img src={playlist.images[0].url} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{playlist.name}</h5>
                <p className="card-text">
                  <small>Playlist By: {playlist.owner.display_name}</small>
                </p>
                <a
                  className="btn btn-dark btn-lg selectButton text-white"
                  onClick={() =>
                    this.selectPlaylist(playlist.id, playlist.images[0].url)
                  }
                >
                  Select Playlist
                </a>
              </div>
            </div>
          ))
        });
      }
    }
  }

  componentWillUnmount() {}

  selectPlaylist(plId, plImg) {
    this.setState({ selectedPlaylistId: plId, selectedPlaylistImg: plImg });
    console.log("plId", plId);
  }

  render() {
    if (!this.state.selectedPlaylistId) {
      return (
        <div className="Welcome">
          <Navbar />
          <div className="jumbotron jumbotron-fluid bg-light">
            <div className="container">
              <h1 className="display-4">Welcome {this.props.userName}</h1>
              <p className="lead">Select a playlist to start shuffling.</p>
              <hr class="my-4" />
              <div class="card-columns">
                <ul className="playlistCards">{this.state.playlists}</ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.selectedPlaylistId) {
      return (
        <Playlist
          token={this.state.token}
          selectedPlaylistId={this.state.selectedPlaylistId}
          selectedPlaylistImg={this.state.selectedPlaylistImg}
        />
      );
    }
  }
}

export default Welcome;

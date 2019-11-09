import React from "react";
import "./Welcome.css";
import Navbar from "./Navbar";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: null
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    if (this.props.numOfPlaylists) {
      console.log("numOfPlaylists", this.props.numOfPlaylists);
      console.log("listOfPlaylists", this.props.listOfPlaylists);
      if (!this.state.playlists) {
        this.setState({
          playlists: this.props.listOfPlaylists.map(playlist => (<div className="card mb-3 text-center">
            <img src={playlist.images[0].url} className="card-img-top"/>
            <div className="card-body">
              <h5 className="card-title">{playlist.name}</h5>
              <p className="card-text">
                <small>Playlist By: {playlist.owner.display_name}</small>
              </p>
              <a href="#" className="btn btn-dark btn-lg shuffleButton">
                Time to Shuffle
              </a>
            </div>
          </div>))
        });
      }
    }
  }

  componentWillUnmount() {}

  render() {
    return (<div className="Welcome">
      <Navbar/>
      <p></p>
      {/* JUMBOTRON. */}
      <div className="jumbotron jumbotron-fluid ">
        <div className="container">
          <h1 className="display-4">Welcome {this.props.userName}</h1>
          <p className="lead">Select a Playlist to start shuffling.</p>
          <hr class="my-4"/>
          <div class="card-columns">
            <ul className="playlistCards">{this.state.playlists}</ul>
          </div>
        </div>
      </div>
      {/* JUMBOTRON. */}
    </div>);
  }
}

export default Welcome;

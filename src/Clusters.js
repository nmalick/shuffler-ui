import React from "react";
import "./Playlist.css";
import Navbar from "./Navbar";
import * as $ from "jquery";



class Clusters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          token: null,
          songClusters: null
        };
        
      }


//React Setup Functions
componentDidMount() {
    if (this.props.token && this.props.songClusters) {
      this.setState({ 
        token: this.props.token,
        songClusters: this.props.songClusters });
    }
  }

  componentDidUpdate() {
    
  }

  componentWillUnmount() { }


render(){
    return(
        <div className="SongClusters">
            <Navbar />
            <div className="jumbotron jumbotron-fluid bg-light">
                <div className="container">
                    <h1>Songs Clusters: {this.state.songClusters}</h1>
                </div>
            </div>
        </div>
    )
}

}

export default Clusters;
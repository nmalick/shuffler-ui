import React from "react";
import "./react-vis.css";
import Navbar from "./Navbar";
import * as $ from "jquery";
import {Bubble} from 'react-chartjs-2';
import { trackDataEndpoint } from "./config";


class Clusters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          token: null,
          songClusters: null,
          playlistName: null
        };
        this.getTrackData = this.getTrackData.bind(this);
      }


//React Setup Functions
async componentDidMount() {
    if (this.props.token && this.props.songClusters) {
      this.setState({ 
        token: this.props.token,
        songClusters: this.props.songClusters 
      });
      
      var newSongClusters = new Array();
      for(var i=0; i<this.props.songClusters.length; i++){
        var songRow = new Array();
        for(var j=0; j<this.props.songClusters[i].length; j++ ){
          var newTrackData = await this.getTrackData(this.props.token, this.props.songClusters[i][j]);
          songRow.push(newTrackData.name);
        }
        newSongClusters.push(songRow);
      }
      this.setState({
        songClusters: newSongClusters
      });
      console.log("newSongClusters", this.state.songClusters);
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {}


  getTrackData(token, trackID) {
    return $.ajax({
      url: `${trackDataEndpoint}` + trackID,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // console.log("data", data.name);
      }
    });
  }
  

render(){ 

  var  myData;
  if(this.state.songClusters){
    var dataPoints = new Array();
    for(var i=0; i< this.state.songClusters.length;i++){
      for(var j=0; j<this.state.songClusters[i].length;j++){
        var dataPoint = {
          label: this.state.songClusters[i][j],
          backgroundColor:'#943126',
          pointStyle:'circle',
          data: [{x:10,y:20,r:20}]
        }
        dataPoints.push(dataPoint);
      }
    }

      myData = {datasets: dataPoints}
      console.log("My data", myData);

}

 

    return(
        <div className="SongClusters">
            <Navbar />
            <div className="jumbotron jumbotron-fluid bg-light">
            <div className="container">
              <h1 className="display-4">Cluster Graph for {this.props.playlistName}</h1>
              <br/>
              <div>
                <Bubble 
                data={myData}
                />
              </div>
            </div>
            </div>
        </div>
    )
}

}

export default Clusters;
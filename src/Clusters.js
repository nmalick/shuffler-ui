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
          playlistName: null,
          clusterColors: null,
          clusterBorder: null
        };
        this.getTrackData = this.getTrackData.bind(this);
        this.getPosition = this.getPosition.bind(this);
      }


//React Setup Functions
async componentDidMount() {
    if (this.props.token && this.props.songClusters) {
      this.setState({ 
        token: this.props.token,
        songClusters: this.props.songClusters 
      });
      
      var newSongClusters = new Array();
      var newSongColors = new Array();
      var newClusterBorders = new Array();
      for(var i=0; i<this.props.songClusters.length; i++){
        var songRow = new Array();
        for(var j=0; j<this.props.songClusters[i].length; j++){
          var newTrackData = await this.getTrackData(this.props.token, this.props.songClusters[i][j]);
          songRow.push(newTrackData.name);
        }
        newSongClusters.push(songRow);

        var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16+i);});
        newSongColors.push(randomColor);

        var newBorderPos = this.props.songClusters[i].length/10;
        newClusterBorders.push(newBorderPos);
      }
      this.setState({
        songClusters: newSongClusters,
        clusterColors: newSongColors,
        clusterBorder: newClusterBorders
      });
      console.log("newSongClusters", this.state.songClusters);
      console.log("newSongBorders", this.state.clusterBorder);
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
  

  getPosition(posI){
    var offSet = 0;
    for(var i=0; i< posI; i++){
      offSet += this.state.clusterBorder[i];
    }
    return [{
      x: Math.random() * (this.state.clusterBorder[posI] - 0) + offSet,
      y:Math.random() * (this.state.clusterBorder[posI]  - 0) + 0,
      r:20
    }]
  }


render(){ 

  var  myData;
  if(this.state.songClusters && this.state.clusterColors){
    var dataPoints = new Array();
    for(var i=0; i< this.state.songClusters.length;i++){
      for(var j=0; j<this.state.songClusters[i].length;j++){
        var dataPoint = {
          label: this.state.songClusters[i][j],
          backgroundColor: this.state.clusterColors[i],
          pointStyle:'circle',
          data: this.getPosition(i)
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
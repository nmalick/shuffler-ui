import React from 'react';
// import logoCC from './images/shufflerLogo - circle - cropped.PNG';
import './Welcome.css';


function Welcome(props) {
  return(
    <div>
      <h1>Hello, {props.name}</h1>;
    </div>
  )
}

export default Welcome;

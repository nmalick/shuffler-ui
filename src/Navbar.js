import React from "react";
import "./Navbar.css";
import { welcomeUrl } from "./config";
import shufflerIcon from "./images/shufflerNew-circle-cropped.svg";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <a className="navbar-brand">
        <img src="shufflerIcon" class="d-inline-block align-top" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="welcomeUrl">
              Home
              <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Player
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Tracks
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Profile
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <form className="form-inline ">
              <input
                className="form-control mr-sm-2 "
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn searchButton my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

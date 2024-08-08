import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import "../styles/common.css";
import PlaneInfo from "./PlaneInfo";
import PlaneAboveMe from "./PlaneAboveMe";
import useFetchPlanesData from "../hooks/useFetchPlanesData"; 

const RADIUS = 20;
const API_URL = "https://api.airplanes.live/v2/";

const Home = () => {
  const [locationDetails, setLocationDetails] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Use the custom hook to fetch planes data
  const { planes, loading, error, fetchPlanesData } =
    useFetchPlanesData(RADIUS);

  // Handle geolocation success
  const handleGeolocationSuccess = ({ coords: { latitude, longitude } }) => {
    setLocationDetails({ latitude, longitude });
    fetchPlanesData(latitude, longitude, RADIUS);
  };

  // Handle geolocation failure
  const handleGeolocationError = () => {
    console.error("Geolocation is not available or was denied.");
  };

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      );
    } else {
      handleGeolocationError();
    }
  }, []);

  const handleReload = () => {
    const { latitude, longitude } = locationDetails;
    // fetchPlanesData(latitude, longitude, RADIUS);
    fetchPlanesData(latitude, longitude);
  };

  return (
    <div>
      <PlaneAboveMe />
      <header className="header-container">
        <div>
          <p>Planes above me within a {RADIUS} km radius</p>
        </div>
      </header>

      <div>
        <p>Total planes above you right now: {planes.length}</p>
        <button className="reload-btn" onClick={handleReload}>
          &#9992; Reload
        </button>
        <div className="main-container">
          {loading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h1>Error: {error}</h1>
          ) : planes.length === 0 ? (
            <h1>No Planes Above You</h1>
          ) : (
            planes.map((plane, index) => (
              <PlaneInfo key={index} index={index} planeDetails={plane} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

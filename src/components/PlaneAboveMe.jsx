import React, { useEffect, useState } from "react";
import useFetchPlanesData from "../hooks/useFetchPlanesData";
import "../styles/common.css";
import PlaneInfo from "./PlaneInfo";

const RADIUS = 20;

const PlaneAboveMe = () => {
  const { planes, loading, error, fetchPlanesData } =
    useFetchPlanesData(RADIUS);

  useEffect(() => {
    // Fetch planes immediately on component mount
    fetchPlanes();

    // Set up an interval to fetch planes every minute (60000 ms)
    const intervalId = setInterval(fetchPlanes, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once when component mounts

  const fetchPlanes = () => {
    // Galway 53.27478,-9.04804
    // Dublin 53.33000,-6.25548
    const lat = 53.27478,
      long = -9.04804;
    fetchPlanesData(lat, long, RADIUS);
  };

  return (
    <div>
      <p>Above Galway!</p>
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
  );
};

export default PlaneAboveMe;

import React from "react";
import { convertSpeedToKmph } from "../utils/utils";
// PlaneInfo component to display individual plane's information
const PlaneInfo = (props) => {
  const { planeDetails, index } = props;

  return (
    <div className="plane-container">
      <h3>&#9992; Plane Information: {index + 1}</h3>
      <p>Flight no: {planeDetails.flight}</p>
      <p>Type: {planeDetails.t}</p>
      <p>Description: {planeDetails.desc}</p>
      <p>Altitude: {planeDetails.alt_baro} ft</p>
      <p>
        Speed: {planeDetails.gs} kt ({convertSpeedToKmph(planeDetails.gs)} km/h)
      </p>
    </div>
  );
};

export default PlaneInfo;

import React, { useEffect, useState, useRef } from "react";
import useFetchPlanesData from "../hooks/useFetchPlanesData";
import "../styles/common.css";
import PlaneInfo from "./PlaneInfo";
import { convertSpeedToKmph, getFormattedDateTime } from "../utils/utils";
import fetchPlanesData from "../service/service";

const RADIUS = 20;
const KEY = import.meta.env.VITE_SMTP_TOKEN;

const PlaneAboveMe = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousPlanesRef = useRef([]); // Use ref to store the previous planes data

  useEffect(() => {
    fetchPlanes();
    const intervalId = setInterval(fetchPlanes, 3000); // Fetch planes every minute

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  const fetchPlanes = () => {
    // Galway 53.27478,-9.04804
    // Dublin 53.33000,-6.25548
    const lat = 53.27478,
      long = -9.04804;
    setLoading(true);
    setError(null);

    fetchPlanesData(lat, long, RADIUS)
      .then((planeData) => {
        // console.log("planeData--->>", planeData);
        // checkPlanes(planeData);
        setPlanes(planeData);
        detectNewEntries(planeData);
        previousPlanesRef.current = planeData;
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const checkPlanes = (planeData) => {
  //   console.log(import.meta.env.SMTP_TOKEN);
  //   console.log("check planes;:::", planeData);
  //   if (planeData.length === 0) {
  //     console.log("Dont send email;");
  //   } else {
  //     console.log("Send email");
  //     handleEmail(planeData);
  //   }
  // };

  const detectNewEntries = (planeData) => {
    const previousPlanes = previousPlanesRef.current;
    const newPlanes = planeData.filter(
      (newPlane) =>
        !previousPlanes.some((prevPlane) => prevPlane.hex === newPlane.hex)
    );

    if (newPlanes.length > 0) {
      console.log("New planes detected:", newPlanes);
      // You can handle new plane entries here, e.g., trigger an email

      // Update the ref with the latest plane data by adding the new planes
      previousPlanesRef.current = [...previousPlanes, ...newPlanes];

      // Log the updated list of all planes (for debugging)
      console.log("Updated planes list:", previousPlanesRef.current);

      handleEmail(previousPlanesRef.current);
    }
  };

  const handleEmail = (planeData) => {
    const timeStamp = getFormattedDateTime();
    let planeWord = planeData.length === 1 ? "Plane" : "Planes";
    const Subject = `[${timeStamp}] ${planeWord} above you ${planeData.length}!`;
    const str = `   Hi,\n ${planeWord} above you are ${planeData.length}. \nTime: ${timeStamp} \n\n`;
    let tempBody =
      str +
      planeData.map(
        (plane, index) =>
          `${index + 1}. ${plane.flight} ${plane.t} ${plane.desc} ${
            plane.alt_baro
          } ft ${plane.gs} kt ${convertSpeedToKmph(plane.gs)} km/h  \n\n`
      );

    // console.log("please--->>> Email sent", Subject, tempBody.toString());
    Email.send({
      SecureToken: KEY,
      To: "niharsonawane@gmail.com",
      From: "niharsonawane@gmail.com",
      Subject: Subject,
      Body: tempBody.toString(),
    }).then((message) => console.log("Email sent!"));
  };

  return (
    <div>
      {/* <button onClick={() => handleEmail()}>CLick me</button> */}
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

const DUMMY_OBJECT = [
  {
    hex: "4ca748",
    type: "adsb_icao",
    flight: "EIEDB   ",
    r: "EI-EDB",
    t: "C152",
    desc: "CESSNA 152",
    ownOp: "O'connor Kieran Augustine",
    year: "1978",
    alt_baro: 1575,
    alt_geom: 1725,
    gs: 105.6,
    track: 115.84,
    geom_rate: 64,
    squawk: "7000",
    emergency: "none",
    category: "A1",
    lat: 53.406052,
    lon: -6.626561,
    nic: 8,
    rc: 186,
    seen_pos: 0.006,
    recentReceiverIds: [
      "a6faedcb-1b67-f17c",
      "3272f280-a925-440d",
      "6ef91a51-e575-439f",
    ],
    version: 2,
    nic_baro: 0,
    nac_p: 10,
    nac_v: 0,
    sil: 3,
    sil_type: "perhour",
    gva: 2,
    sda: 0,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 6280,
    seen: 0,
    rssi: -15.9,
    dst: 14.056,
    dir: 289.1,
  },
  {
    hex: "4ca303",
    type: "adsb_icao",
    flight: "RYR2HG  ",
    r: "EI-DLX",
    t: "B738",
    desc: "BOEING 737-800",
    ownOp: "Ryanair Designated Activity Company",
    year: "2006",
    alt_baro: 7625,
    alt_geom: 7800,
    gs: 260.8,
    ias: 253,
    tas: 284,
    mach: 0.436,
    wd: 264,
    ws: 38,
    oat: 6,
    tat: 17,
    track: 207.65,
    track_rate: -1.88,
    roll: -26.72,
    mag_heading: 215.68,
    true_heading: 214.08,
    baro_rate: 3968,
    geom_rate: 3904,
    squawk: "2241",
    emergency: "none",
    category: "A3",
    nav_qnh: 1013.6,
    nav_altitude_mcp: 12000,
    nav_altitude_fms: 19008,
    nav_heading: 175.08,
    lat: 53.474788,
    lon: -6.477975,
    nic: 8,
    rc: 186,
    seen_pos: 0.006,
    recentReceiverIds: [
      "7ac6f314-8044-4168",
      "f3e7ed53-ed71-4609",
      "3272f280-a925-440d",
      "93dd135f-5213-4bc9",
      "6ef91a51-e575-439f",
      "20c27ae9-d37c-4c2c",
      "3caa3b55-bc27-441d",
      "a6faedcb-1b67-f17c",
      "d7c6ea49-1f4b-469d",
    ],
    version: 2,
    nic_baro: 1,
    nac_p: 8,
    nac_v: 1,
    sil: 3,
    sil_type: "perhour",
    gva: 1,
    sda: 2,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 34893,
    seen: 0,
    rssi: -4.6,
    dst: 11.79,
    dir: 317.6,
  },
  {
    hex: "40686f",
    type: "mlat",
    flight: "WKT48   ",
    r: "G-YDEA",
    t: "DA42",
    desc: "DIAMOND DA-42 Guardian",
    ownOp: "Diamond Executive Aviation",
    year: "2006",
    alt_baro: 1400,
    ias: 127,
    mach: 0.196,
    calc_track: 278,
    mag_heading: 287.05,
    true_heading: 285.51,
    baro_rate: 32,
    squawk: "6232",
    nav_qnh: 1013,
    nav_altitude_mcp: 1408,
    lat: 53.352946,
    lon: -6.383739,
    nic: 0,
    rc: 0,
    seen_pos: 3.131,
    recentReceiverIds: [],
    alert: 0,
    spi: 0,
    mlat: ["lat", "lon", "nic", "rc"],
    tisb: [],
    messages: 24720,
    seen: 1.2,
    rssi: -7,
    dst: 4.8,
    dir: 286.7,
  },
  {
    hex: "4ca9ba",
    type: "adsb_icao",
    flight: "EIN3GM  ",
    r: "EI-LRA",
    t: "A21N",
    desc: "AIRBUS A-321neo",
    ownOp: "Aer Lingus",
    alt_baro: 275,
    alt_geom: 450,
    gs: 125.6,
    ias: 145,
    mach: 0.22,
    track: 275.48,
    mag_heading: 277.21,
    true_heading: 275.71,
    baro_rate: -640,
    geom_rate: -640,
    squawk: "6665",
    emergency: "none",
    category: "A3",
    nav_qnh: 1012,
    nav_altitude_mcp: 3008,
    nav_heading: 0,
    lat: 53.420288,
    lon: -6.251221,
    nic: 8,
    rc: 186,
    seen_pos: 37.613,
    recentReceiverIds: [],
    version: 2,
    nic_baro: 1,
    nac_p: 10,
    nac_v: 2,
    sil: 3,
    sil_type: "perhour",
    gva: 2,
    sda: 2,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 64190,
    seen: 37.6,
    rssi: -20.7,
    dst: 5.423,
    dir: 1.6,
  },
  {
    hex: "4076e2",
    type: "adsb_icao",
    flight: "BAW835W ",
    r: "G-NEOT",
    t: "A21N",
    desc: "AIRBUS A-321neo",
    ownOp: "British Airways",
    alt_baro: "ground",
    gs: 0,
    true_heading: 315,
    squawk: "5464",
    emergency: "none",
    category: "A3",
    lat: 53.424683,
    lon: -6.240372,
    nic: 8,
    rc: 186,
    seen_pos: 21.661,
    recentReceiverIds: [],
    version: 2,
    nac_p: 9,
    nac_v: 1,
    sil: 3,
    sil_type: "perhour",
    sda: 2,
    mlat: [],
    tisb: [],
    messages: 63624,
    seen: 21.7,
    rssi: -22.4,
    dst: 5.711,
    dir: 5.4,
  },
  {
    hex: "4ca84f",
    type: "adsb_icao",
    flight: "RYR7WM  ",
    r: "EI-EMH",
    t: "B738",
    desc: "BOEING 737-800",
    ownOp: "Ryanair Designated Activity Company",
    year: "2010",
    alt_baro: 3375,
    alt_geom: 3625,
    gs: 179.4,
    ias: 192,
    mach: 0.308,
    track: 220.71,
    mag_heading: 232.73,
    true_heading: 231.35,
    baro_rate: -768,
    geom_rate: -736,
    squawk: "1142",
    emergency: "none",
    category: "A3",
    nav_qnh: 1012,
    nav_altitude_mcp: 3008,
    nav_altitude_fms: 3008,
    nav_heading: 206.72,
    lat: 53.410858,
    lon: -5.943917,
    nic: 8,
    rc: 186,
    seen_pos: 0.878,
    recentReceiverIds: [
      "3caa3b55-bc27-441d",
      "d7c6ea49-1f4b-469d",
      "f3e7ed53-ed71-4609",
      "a6faedcb-1b67-f17c",
      "6ef91a51-e575-439f",
    ],
    version: 2,
    nic_baro: 1,
    nac_p: 8,
    nac_v: 1,
    sil: 3,
    sil_type: "perhour",
    gva: 1,
    sda: 2,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 121255,
    seen: 0.2,
    rssi: -11.2,
    dst: 12.171,
    dir: 66.4,
  },
  {
    hex: "4ca27b",
    type: "adsb_icao",
    flight: "RYR9VA  ",
    r: "EI-DHR",
    t: "B738",
    desc: "BOEING 737-800",
    ownOp: "Ryanair Designated Activity Company",
    year: "2005",
    alt_baro: 12725,
    alt_geom: 13050,
    gs: 396.4,
    ias: 284,
    tas: 346,
    mach: 0.54,
    wd: 265,
    ws: 52,
    oat: -3,
    tat: 13,
    track: 97.54,
    track_rate: 0,
    roll: -0.53,
    mag_heading: 100.72,
    true_heading: 99.33,
    baro_rate: 2880,
    geom_rate: 2880,
    squawk: "5245",
    emergency: "none",
    category: "A3",
    nav_qnh: 1013.6,
    nav_altitude_mcp: 23008,
    nav_altitude_fms: 35008,
    nav_heading: 101.95,
    lat: 53.497971,
    lon: -5.906799,
    nic: 8,
    rc: 186,
    seen_pos: 0,
    recentReceiverIds: [
      "3272f280-a925-440d",
      "7ac6f314-8044-4168",
      "93dd135f-5213-4bc9",
      "20c27ae9-d37c-4c2c",
      "d7c6ea49-1f4b-469d",
      "a6faedcb-1b67-f17c",
      "3caa3b55-bc27-441d",
      "6ef91a51-e575-439f",
    ],
    version: 2,
    nic_baro: 1,
    nac_p: 8,
    nac_v: 1,
    sil: 3,
    sil_type: "perhour",
    gva: 1,
    sda: 2,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 30458,
    seen: 0,
    rssi: -8,
    dst: 16.008,
    dir: 50.8,
  },
  {
    hex: "4ca9cd",
    type: "adsb_icao",
    flight: "RYR6NY  ",
    r: "EI-EVF",
    t: "B738",
    desc: "BOEING 737-800",
    ownOp: "Ryanair Designated Activity Company",
    year: "2012",
    alt_baro: 7275,
    alt_geom: 7575,
    gs: 272.3,
    ias: 254,
    tas: 284,
    mach: 0.436,
    wd: 308,
    ws: 14,
    oat: 6,
    tat: 17,
    track: 342.03,
    track_rate: 0.03,
    roll: 0,
    mag_heading: 341.72,
    true_heading: 340.42,
    baro_rate: -448,
    geom_rate: -480,
    squawk: "5743",
    emergency: "none",
    category: "A3",
    nav_qnh: 1012,
    nav_altitude_mcp: 3008,
    nav_heading: 341.72,
    lat: 53.155952,
    lon: -5.813626,
    nic: 8,
    rc: 186,
    seen_pos: 0.22,
    recentReceiverIds: [
      "a6faedcb-1b67-f17c",
      "3caa3b55-bc27-441d",
      "6ef91a51-e575-439f",
      "d7c6ea49-1f4b-469d",
      "93dd135f-5213-4bc9",
    ],
    version: 2,
    nic_baro: 1,
    nac_p: 8,
    nac_v: 1,
    sil: 3,
    sil_type: "perhour",
    gva: 1,
    sda: 2,
    alert: 0,
    spi: 0,
    mlat: [],
    tisb: [],
    messages: 63281,
    seen: 0.2,
    rssi: -12.4,
    dst: 19.006,
    dir: 123.2,
  },
];

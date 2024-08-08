import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/home.css";

const RADIUS = 20;
const API_URL = "https://api.airplanes.live/v2/";

const Home = () => {
  const [planes, setPlanes] = useState([]);
  const [locationDetails, setLocationDetails] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch plane data based on current location and radius
  const fetchPlanesData = useCallback(async (latitude, longitude, radius) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/point/${latitude}/${longitude}/${radius}`);
      setPlanes(response.data.ac || []);
    } catch (error) {
      console.error("Error fetching planes data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setLocationDetails({ latitude, longitude });
        fetchPlanesData(latitude, longitude, RADIUS);
      });
    } else {
      console.log("Geolocation is not available");
    }
  }, [fetchPlanesData]);

  const handleReload = () => {
    const { latitude, longitude } = locationDetails;
    fetchPlanesData(latitude, longitude, RADIUS);
  };

  const convertSpeedToKmph = (knots) => (knots * 1.852).toFixed(2);

  return (
    <div>
      <header className="header-container">
        <div>
          <p>Planes above me within a {RADIUS} km radius</p>
          <p>Total planes above you right now: {planes.length}</p>
        </div>
        <button className="reload-btn" onClick={handleReload}>
          &#9992; Reload
        </button>
      </header>

      <main className="main-container">
        {loading ? (
          <h3>Loading...</h3>
        ) : planes.length === 0 ? (
          <h1>No Planes Above You</h1>
        ) : (
          planes.map((plane, index) => (
            <div key={index} className="plane-container">
              <h3>&#9992; Plane Information: {index + 1}</h3>
              <p>Type: {plane.t}</p>
              <p>Description: {plane.desc}</p>
              <p>Altitude: {plane.alt_baro} ft</p>
              <p>
                Speed: {plane.gs} kt (~{convertSpeedToKmph(plane.gs)} km/h)
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;


const DUMMYOBJECT = {
  ac: [
    {
      hex: "4cafe5",
      type: "adsb_icao",
      r: "EI-SKP",
      t: "C172",
      desc: "CESSNA 172 Skyhawk",
      alt_baro: 1300,
      gs: 88,
      track: 341.2,
      baro_rate: 53,
      squawk: "7000",
      category: "A1",
      lat: 53.387741,
      lon: -6.873675,
      nic: 6,
      rc: 556,
      seen_pos: 8.34,
      recentReceiverIds: [],
      version: 2,
      nic_baro: 1,
      mlat: [],
      tisb: [],
      messages: 831,
      seen: 8.3,
      rssi: -49.5,
      dst: 12.609,
      dir: 326.9,
    },
    {
      hex: "4cac54",
      type: "adsb_icao",
      flight: "RYR1PJ  ",
      r: "EI-HGP",
      t: "B38M",
      desc: "BOEING 737 MAX 8",
      ownOp: "Ryanair",
      alt_baro: 34000,
      alt_geom: 35050,
      gs: 391.2,
      ias: 262,
      tas: 444,
      mach: 0.756,
      wd: 265,
      ws: 85,
      oat: -46,
      tat: -20,
      track: 209.05,
      track_rate: 0,
      roll: -0.35,
      mag_heading: 219.9,
      true_heading: 218.16,
      baro_rate: 0,
      geom_rate: 32,
      squawk: "3476",
      emergency: "none",
      category: "A3",
      nav_qnh: 1013.6,
      nav_altitude_mcp: 34016,
      nav_altitude_fms: 34000,
      nav_heading: 217.97,
      lat: 53.445694,
      lon: -6.833888,
      nic: 8,
      rc: 186,
      seen_pos: 0.272,
      recentReceiverIds: [
        "2efc9f5a-be35-4dfa",
        "93dd135f-5213-4bc9",
        "7ac6f314-8044-4168",
        "6ef91a51-e575-439f",
        "7739f071-aa2f-474c",
        "20c27ae9-d37c-4c2c",
        "a6faedcb-1b67-f17c",
        "e2e49a1b-3387-4a66",
        "d7c6ea49-1f4b-469d",
        "3272f280-a925-440d",
        "3caa3b55-bc27-441d",
      ],
      version: 2,
      nic_baro: 1,
      nac_p: 11,
      nac_v: 2,
      sil: 3,
      sil_type: "perhour",
      gva: 2,
      sda: 2,
      alert: 0,
      spi: 0,
      mlat: [],
      tisb: [],
      messages: 67608,
      seen: 0,
      rssi: -6.2,
      dst: 15.061,
      dir: 338.8,
    },
    {
      hex: "407699",
      type: "adsb_icao",
      flight: "VIR45W  ",
      r: "G-VPRD",
      t: "A35K",
      desc: "AIRBUS A-350-1000",
      ownOp: "Virgin Atlantic Airways",
      alt_baro: 35000,
      alt_geom: 36100,
      gs: 424.8,
      ias: 289,
      tas: 494,
      mach: 0.844,
      wd: 275,
      ws: 76,
      oat: -48,
      tat: -15,
      track: 301.03,
      track_rate: -0.03,
      roll: -0.88,
      mag_heading: 298.83,
      true_heading: 297.13,
      baro_rate: 0,
      geom_rate: 32,
      squawk: "5174",
      emergency: "none",
      category: "A5",
      nav_qnh: 1013.6,
      nav_altitude_mcp: 35008,
      nav_heading: 298.83,
      lat: 53.340866,
      lon: -6.775112,
      nic: 8,
      rc: 186,
      seen_pos: 0.061,
      recentReceiverIds: [
        "20c27ae9-d37c-4c2c",
        "a6faedcb-1b67-f17c",
        "3272f280-a925-440d",
        "7ac6f314-8044-4168",
        "d7c6ea49-1f4b-469d",
        "7739f071-aa2f-474c",
        "2efc9f5a-be35-4dfa",
        "6ef91a51-e575-439f",
        "e2e49a1b-3387-4a66",
        "cc620bd2-01aa-4f21",
        "93dd135f-5213-4bc9",
        "3caa3b55-bc27-441d",
        "f3e7ed53-ed71-4609",
      ],
      version: 2,
      nic_baro: 1,
      nac_p: 11,
      nac_v: 2,
      sil: 3,
      sil_type: "perhour",
      gva: 2,
      sda: 2,
      alert: 0,
      spi: 0,
      mlat: [],
      tisb: [],
      messages: 20337,
      seen: 0,
      rssi: -11.2,
      dst: 8.44,
      dir: 336.5,
    },
    {
      hex: "4d244d",
      type: "adsb_icao",
      flight: "BLX1404 ",
      r: "9H-GKJ",
      t: "A320",
      desc: "AIRBUS A-320",
      alt_baro: 6425,
      alt_geom: 6550,
      gs: 224.4,
      ias: 219,
      tas: 244,
      mach: 0.372,
      wd: 240,
      ws: 31,
      track: 186.4,
      track_rate: -1.16,
      roll: -13.54,
      mag_heading: 193.89,
      true_heading: 192.31,
      baro_rate: 192,
      geom_rate: 224,
      squawk: "5252",
      emergency: "none",
      category: "A3",
      nav_qnh: 1012.8,
      nav_altitude_mcp: 12000,
      nav_heading: 199.69,
      lat: 53.408824,
      lon: -6.444047,
      nic: 8,
      rc: 186,
      seen_pos: 0,
      recentReceiverIds: [
        "3272f280-a925-440d",
        "6ef91a51-e575-439f",
        "a6faedcb-1b67-f17c",
        "7ac6f314-8044-4168",
        "f3e7ed53-ed71-4609",
        "d7c6ea49-1f4b-469d",
        "3caa3b55-bc27-441d",
        "93dd135f-5213-4bc9",
      ],
      version: 2,
      nic_baro: 1,
      nac_p: 9,
      nac_v: 1,
      sil: 3,
      sil_type: "perhour",
      gva: 2,
      sda: 2,
      alert: 0,
      spi: 0,
      mlat: [],
      tisb: [],
      messages: 1622,
      seen: 0,
      rssi: -4.9,
      dst: 14.595,
      dir: 35.6,
    },
    {
      hex: "4ca6c4",
      type: "adsb_icao",
      flight: "EIN448  ",
      r: "EI-DVI",
      t: "A320",
      desc: "AIRBUS A-320",
      ownOp: "Aer Lingus Limited",
      year: "2008",
      alt_baro: 2925,
      alt_geom: 2900,
      gs: 209.6,
      ias: 194,
      mach: 0.308,
      track: 323.73,
      mag_heading: 323.79,
      true_heading: 322.24,
      baro_rate: 1216,
      geom_rate: 1120,
      squawk: "4760",
      emergency: "none",
      category: "A3",
      nav_qnh: 1004,
      nav_altitude_mcp: 12000,
      lat: 53.46045,
      lon: -6.346786,
      nic: 8,
      rc: 186,
      seen_pos: 0.384,
      recentReceiverIds: [
        "a6faedcb-1b67-f17c",
        "3272f280-a925-440d",
        "3caa3b55-bc27-441d",
        "6ef91a51-e575-439f",
        "7ac6f314-8044-4168",
        "d7c6ea49-1f4b-469d",
        "f3e7ed53-ed71-4609",
      ],
      version: 2,
      nic_baro: 1,
      nac_p: 9,
      nac_v: 1,
      sil: 3,
      sil_type: "perhour",
      gva: 2,
      sda: 2,
      alert: 0,
      spi: 0,
      mlat: [],
      tisb: [],
      messages: 528,
      seen: 0,
      rssi: -10.6,
      dst: 19.144,
      dir: 38.7,
    },
    {
      hex: "4cad7d",
      type: "adsb_icao",
      flight: "EIN16C  ",
      r: "EI-NSD",
      t: "A20N",
      desc: "AIRBUS A-320neo",
      alt_baro: "ground",
      gs: 20.5,
      true_heading: 95.62,
      squawk: "5431",
      emergency: "none",
      category: "A3",
      lat: 53.4226,
      lon: -6.261305,
      nic: 8,
      rc: 186,
      seen_pos: 10.586,
      recentReceiverIds: [],
      version: 2,
      nac_p: 9,
      nac_v: 2,
      sil: 3,
      sil_type: "perhour",
      sda: 2,
      mlat: [],
      tisb: [],
      messages: 22261,
      seen: 10.6,
      rssi: -22.2,
      dst: 19.672,
      dir: 49.8,
    },
  ],
  msg: "No error",
  now: 1723123668002,
  total: 6,
  ctime: 1723123668002,
  ptime: 0,
};

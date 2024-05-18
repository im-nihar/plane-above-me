import React, { useEffect, useState } from "react";
import { FlightRadar24API } from "flightradarapi";
import axios from 'axios';

const Home = () => {
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("HEeeee");
    const fetchFlightData = async () => {
      console.log("11");
      try {
        console.log("22");

        const response = await axios.get("http://localhost:5000/api/flights");
        console.log("33");

        console.log("response-->>", response);
        // setFlightData(response.data);
      } catch (error) {
        // setError(error);
      }
    };

    fetchFlightData();
  }, []);

  const getFlights = async () => {
    let flights = frApi.getFlights();
    // let res = await flights.json();

    console.log("Heeee", flights);
    // flights.then((res) => {
    //   console.log("res", res);
    // });
  };

  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default Home;

import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = "https://api.airplanes.live/v2/";

const useFetchPlanesData = (radius) => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanesData = useCallback(
    async (latitude, longitude) => {
      setLoading(true);
      setError(null); // Reset error before new request
      try {
        // Galway 53.27478,-9.04804
        // Dublin 53.33000,-6.25548
        // const response = await axios.get(
        //   `${API_URL}/point/53.33000/-6.25548/${radius}`
        // );
        const response = await axios.get(
          `${API_URL}/point/${latitude}/${longitude}/${radius}`
        );
        setPlanes(response.data.ac || []);
      } catch (err) {
        console.error("Error fetching planes data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [radius]
  );

  return { planes, loading, error, fetchPlanesData };
};

export default useFetchPlanesData;

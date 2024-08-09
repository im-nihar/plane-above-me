import axios from "axios";

const API_URL = "https://api.airplanes.live/v2/";

/**
 * Fetches plane data based on the provided latitude, longitude, and radius.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @param {number} radius - The radius within which to search for planes.
 * @returns {Promise<object>} - A promise that resolves with the plane data or rejects with an error.
 */
const fetchPlanesData = async (latitude, longitude, radius) => {
  try {
    // Galway 53.27478,-9.04804
    // Dublin 53.33000,-6.25548
    // const response = await axios.get(
    //   `${API_URL}/point/53.33000/-6.25548/${radius}`
    // );
    const response = await axios.get(
      `${API_URL}/point/${latitude}/${longitude}/${radius}`
    );

    // Resolve the promise with the plane data
    return Promise.resolve(response.data.ac || []);
  } catch (err) {
    console.error("Error fetching planes data:", err);

    // Reject the promise with the error
    return Promise.reject(err);
  }
};

export default fetchPlanesData;

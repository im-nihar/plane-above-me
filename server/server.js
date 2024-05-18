const express = require('express');
const { FlightRadar24API } = require('flightradarapi');
const cors = require('cors');

const app = express();
const port = 5000;
const frApi = new FlightRadar24API();

app.use(cors());

app.get('/api/flights', async (req, res) => {
  try {
    const bounds = frApi.getBoundsByPoint(53.3498, 6.2603, 20); // Example coordinates dublin
    const flights = await frApi.getFlights(null, bounds);
    res.json(flights);
    console.log("flights",res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/airlines', async (req, res) => {
    try {
      const bounds = frApi.getZones(); 
      console.log("bounds",bounds);
    //   res.json(bounds);
      console.log("bounds",   res.json(bounds));

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


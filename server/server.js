const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const moment = require("moment");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());

const API_URL = process.env.API_URL;
const EMAIL = process.env.EMAIL_MAIN;
const PASS_EMAIL = process.env.PASS_EMAIL;
const TEMP_EMAIL = process.env.TEMP_EMAIL;
const TEMP_PASS = process.env.TEMP_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const TEMP_HOST = process.env.TEMP_HOST;
const TEMP_PORT = process.env.TEMP_PORT;

// Define the coordinates and radius
const LATITUDE = 53.27478;
const LONGITUDE = -9.04804;
const RADIUS = 45;

let previousPlanes = [];
let uniquePlanesCount = 0; // Counter for unique planes
let uniquePlanesSet = new Set(); // Set to track unique plane hex codes

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASS_EMAIL,
  },
});

const transporter2 = nodemailer.createTransport({
  host: TEMP_HOST,
  port: TEMP_PORT,
  secure: false,
  auth: {
    user: TEMP_EMAIL,
    pass: TEMP_PASS,
  },
});

// Helper function to convert speed from knots to km/h
const convertSpeedToKmph = (knots) => (knots * 1.852).toFixed(2);

// Helper function to get formatted date and time
const getFormattedDateTime = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

// Function to handle sending email notifications
const handleEmail = (planeData) => {
  // const transporter = nodemailer.createTransport(EMAIL_CONFIG);
  const timeStamp = moment()
    .utc(1000 * 60 * 60 * 1)
    .format("D-MM-YYYY, h:mm:ss a"); //getFormattedDateTime();
  const planeWord = planeData.length === 1 ? "Plane" : "Planes";
  const planeCount =
    uniquePlanesCount == 0 ? "" : `${uniquePlanesCount} of the day!`;
  // const subject = `[${timeStamp}] New ${planeWord} above you: ${planeData.length}!`;
  const subject = `New ${planeWord} above you: ${planeData.length}! ${planeCount}`;
  const body = planeData
    .map(
      (plane, index) =>
        `${index + 1}. ${plane.flight} ${plane.t} ${plane.desc} ${
          plane.alt_baro
        } ft ${plane.gs} kt (${convertSpeedToKmph(plane.gs)} km/h) \n\n`
    )
    .join("");

  const NewBody = `
  <p>Hi,</p>
  <p>The planes above you are: </p>
  <p>Radius: ${RADIUS} </p>
  <ul>
    ${planeData
      .map(
        (plane, index) =>
          `${index + 1}. ${plane.flight} ${plane.t} ${plane.desc} ${
            plane.alt_baro
          } ft ${plane.gs} kt (${convertSpeedToKmph(plane.gs)} km/h)<br><br>`
      )
      .join("")}
  </ul>
  <br>
  <p>Total unique planes counted today: ${uniquePlanesCount}</p>
`;
  {
    /* <p>Time: ${timeStamp}</p> */
  }

  emailHandler(NewBody, subject);
};

// Function to fetch planes data
const fetchPlanesData = () => {
  // console.log("Fetching planes data...");

  axios
    .get(`${API_URL}/point/${LATITUDE}/${LONGITUDE}/${RADIUS}`)
    .then((response) => {
      const planeData = response.data.ac || [];
      // console.log(`Fetched ${planeData.length} planes`);
      detectNewEntries(planeData);
      // You can do something with the data here, like save it to a database
    })
    .catch((error) => {
      console.error("Error fetching planes data:", error.message);
    });
};

// Function to detect new plane entries
const detectNewEntries = (planeData) => {
  const newPlanes = planeData.filter(
    (newPlane) =>
      !previousPlanes.some((prevPlane) => prevPlane.hex === newPlane.hex)
  );

  if (newPlanes.length > 0) {
    // console.log("New planes detected:", newPlanes);
    handleEmail(newPlanes);
    newPlanes.forEach((plane) => {
      if (!uniquePlanesSet.has(plane.hex)) {
        uniquePlanesSet.add(plane.hex);
        uniquePlanesCount++;
      }
    });
    previousPlanes = [...previousPlanes, ...newPlanes];
  }
};

const emailHandler = async (emailBody, subject) => {
  // send mail with defined transport object
  const info = await transporter2.sendMail({
    from: `"ME:" <${EMAIL}>`, // sender address
    to: EMAIL, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world!", // plain text body
    html: emailBody, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

// main().catch(console.error);
// Function to reset the counter at midnight
const resetCounterAtMidnight = () => {
  const now = moment();
  const midnight = moment().endOf("day");
  const duration = midnight.diff(now);

  setTimeout(() => {
    uniquePlanesCount = 0;
    uniquePlanesSet.clear();
    // console.log("Counter reset at midnight");
    // Schedule the next reset for the following day
    resetCounterAtMidnight();
  }, duration);
};

// Start the reset schedule immediately
resetCounterAtMidnight();

setInterval(fetchPlanesData, 3000);

// Optional: Fetch data immediately when the server starts
fetchPlanesData();

// A simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("Planes data server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');  // Add this to make HTTP requests

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = ['https://360.articulate.com', 'https://articulateusercontent.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());  // Parse incoming requests with JSON payloads

// Route for handling Storyline requests
app.post('/storyline', async (req, res) => {
  const { userName } = req.body;  // Extract the userName from the request body

  console.log(`Received userName: ${userName}`);

  try {
    // Forward the userName to Make's webhook endpoint
    const makeResponse = await fetch('https://your-make-webhook-url', {  // Replace with your actual Make URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName })
    });

    const makeData = await makeResponse.json();
    
    if (makeResponse.ok) {
      // Make sent a successful response
      const passcode = makeData.passcode;

      // Return the passcode to Storyline
      res.json({ passcode });
      console.log(`Passcode returned to Storyline: ${passcode}`);
    } else {
      // Handle error if Make response was not OK
      res.status(500).json({ error: 'Error retrieving passcode from Make' });
      console.error('Error retrieving passcode from Make:', makeData);
    }
  } catch (error) {
    // Handle fetch or other errors
    res.status(500).json({ error: 'Error communicating with Make' });
    console.error('Error communicating with Make:', error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

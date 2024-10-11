const express = require('express');
const cors = require('cors'); // Import the CORS package
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = ['https://360.articulate.com', 'https://articulateusercontent.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests only from specific origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow credentials if needed
  optionsSuccessStatus: 204  // Handle OPTIONS preflight requests
};

// Use CORS with the defined configuration
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS) for all routes
app.options('*', cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route for handling Storyline requests
app.post('/storyline', async (req, res) => {
  const { userName } = req.body;
  console.log(`Received userName: ${userName}`);

  try {
    // Forward the userName to Make's webhook endpoint
    const makeResponse = await fetch('https://your-make-webhook-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName })
    });

    const makeData = await makeResponse.json();
    
    if (makeResponse.ok) {
      const passcode = makeData.passcode;
      res.json({ passcode });
      console.log(`Passcode returned to Storyline: ${passcode}`);
    } else {
      res.status(500).json({ error: 'Error retrieving passcode from Make' });
      console.error('Error retrieving passcode from Make:', makeData);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error communicating with Make' });
    console.error('Error communicating with Make:', error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

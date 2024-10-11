import fetch from 'node-fetch'; // Use import instead of require

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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
app.use(express.json());

// Route for handling Storyline requests
app.post('/storyline', async (req, res) => {
  const { webhookId, ...rest } = req.body; // Extract webhookId and pass along any other variables

  console.log(`Received webhookId: ${webhookId}, with data: ${JSON.stringify(rest)}`);

  try {
    // Construct the full Make webhook URL
    const makeWebhookUrl = `https://hook.us1.make.com/${webhookId}`;

    // Forward the data to Make's webhook
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest) // Send all variables received from Storyline
    });

    // Wait for Make to return the final response
    const contentType = makeResponse.headers.get('content-type');
    let makeData;

    // Check if the response is JSON or plain text
    if (contentType && contentType.includes('application/json')) {
      makeData = await makeResponse.json(); // Parse JSON response
    } else {
      makeData = await makeResponse.text(); // Handle non-JSON response
    }

    if (!makeResponse.ok) {
      throw new Error(`Make webhook error: ${makeResponse.statusText}`);
    }

    // Send the final response from Make back to Storyline
    res.json(makeData); // Whatever Make sends back, forward it directly to Storyline
    console.log(`Final data sent to Storyline: ${JSON.stringify(makeData)}`);
  } catch (error) {
    console.error('Error communicating with Make:', error);
    res.status(500).json({ error: 'Error communicating with Make' });
  }
});

app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

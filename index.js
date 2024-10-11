import fetch from 'node-fetch';  // Use import instead of require

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
  const { webhookId, userName, passcode } = req.body;
  console.log(`Received webhookId: ${webhookId}, userName: ${userName}`);

  try {
    // Construct the full Make webhook URL
    const makeWebhookUrl = `https://hook.us1.make.com/${webhookId}`;

    // Forward the userName and passcode to Make's webhook
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, passcode })
    });

    const contentType = makeResponse.headers.get('content-type');

    // Check if the response is JSON or plain text
    let makeData;
    if (contentType && contentType.includes('application/json')) {
      makeData = await makeResponse.json();
    } else {
      makeData = await makeResponse.text(); // Handle non-JSON response
    }

    if (!makeResponse.ok) {
      throw new Error(`Make webhook error: ${makeResponse.statusText}`);
    }

    // If the response is JSON, process the passcode
    if (typeof makeData === 'object' && makeData.passcode) {
      res.json({ passcode: makeData.passcode });
      console.log(`Passcode returned to Storyline: ${makeData.passcode}`);
    } else {
      res.json({ message: makeData });
      console.log(`Non-JSON response from Make: ${makeData}`);
    }
  } catch (error) {
    console.error('Error communicating with Make:', error);
    res.status(500).json({ error: 'Error communicating with Make' });
  }
});

app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

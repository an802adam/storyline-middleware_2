const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration to allow requests from specific origins
const corsOptions = {
  origin: function (origin, callback) {
    if (['https://360.articulate.com', 'https://articulateusercontent.com'].indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow required headers
  credentials: true,  // Allow credentials if needed
  optionsSuccessStatus: 204  // Handle successful preflight requests
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Handle preflight requests (OPTIONS)
app.options('*', cors(corsOptions));

// Route for handling Storyline requests
app.post('/storyline', (req, res) => {
  const userInput = req.body.userName;
  console.log(`Received request from: ${userInput}`);

  // Simulate sending the request to Make and waiting for response
  setTimeout(() => {
    res.json({ passcode: '12345' });
  }, 2000);  // Simulate a delay for response
});

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

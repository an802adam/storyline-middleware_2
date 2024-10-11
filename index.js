const express = require('express');
const cors = require('cors'); // Import the CORS package

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration to allow specific domains
const allowedOrigins = ['https://360.articulate.com', 'https://articulateusercontent.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow request if origin is in the allowed list or is undefined (e.g., for localhost)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow required headers
  credentials: true,  // Allow credentials if needed
  optionsSuccessStatus: 204  // Handle OPTIONS preflight requests with status 204
};

// Use CORS with the defined configuration
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS) for all routes
app.options('*', cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route for handling Storyline requests
app.post('/storyline', (req, res) => {
  const userInput = req.body.userName;
  console.log(`Received request from: ${userInput}`);

  // Simulate sending the request to Make and waiting for response
  setTimeout(() => {
    res.json({ passcode: '12345' }); // Replace with actual logic
  }, 2000);  // Simulate a delay for response
});

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

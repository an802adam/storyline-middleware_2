const express = require('express');
const cors = require('cors'); // Import the CORS package

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow both articulate domains
const corsOptions = {
  origin: ['https://360.articulate.com', 'https://articulateusercontent.com'], // Allow both origins
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow necessary headers
  credentials: true,  // Allow credentials if needed
  optionsSuccessStatus: 204  // Handle OPTIONS preflight request with status 204
};

// Use CORS with the above configuration
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route for handling Storyline request
app.post('/storyline', (req, res) => {
  const userInput = req.body.userName;
  console.log(`Received request from: ${userInput}`);

  // Simulate sending the request to Make and waiting for response
  setTimeout(() => {
    res.json({ passcode: '12345' }); // Replace this with actual logic to get data from Make
  }, 2000); // Simulate a delay
});

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions));  // Enable preflight for all routes

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

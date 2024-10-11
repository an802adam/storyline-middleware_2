const express = require('express');
const cors = require('cors'); // Import the CORS package

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware to enable cross-origin requests specifically for articulateusercontent.com
app.use(cors({
  origin: 'https://articulateusercontent.com',  // Allow requests from Articulate's content hosting
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow the required headers
  preflightContinue: false,
  optionsSuccessStatus: 204  // Handle successful preflight requests
}));

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

// Start the server
app.listen(port, () => {
  console.log(`Middleware server listening on port ${port}`);
});

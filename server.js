const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8000;
const cors = require('cors');

// Refined CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL, e.g., http://localhost:3000 for React frontend
  methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
  credentials: true, // Allow credentials such as cookies, authentication
};

// Use CORS middleware
app.use(cors(corsOptions));  

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to log user actions to the terminal and CSV file
function logActionToCSV(user_id, action) {
  const logEntry = `${user_id}, ${action}, ${new Date().toISOString()}`;
  
  // Log to the terminal
  console.log(`Action logged: ${logEntry}`);
  
  // Optionally write to CSV file
  fs.appendFile('actions_log.csv', logEntry + '\n', (err) => {
    if (err) {
      console.error('Error writing to CSV file', err);
    }
  });
}

// POST route to log user actions
app.post('/log-action', (req, res) => {
  const { user_id, action } = req.body;

  if (!user_id || !action) {
    return res.status(400).send('Invalid request: Missing user_id or action');
  }

  // Log the action to the terminal and CSV
  logActionToCSV(user_id, action);

  // Respond to the frontend
  res.send('Action logged successfully.');
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

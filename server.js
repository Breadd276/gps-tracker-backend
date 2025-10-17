// Node.js + Express backend for GPS tracker with history & impact events
const express = require('express');
const app = express();
app.use(express.json());

let locationHistory = []; // Track device history

// POST endpoint: Device sends data { lat, lon, impact }
app.post('/update', (req, res) => {
  locationHistory.push({
    lat: req.body.lat,
    lon: req.body.lon,
    impact: !!req.body.impact,
    timestamp: new Date().toISOString()
  });
  // Optionally limit history size
  if (locationHistory.length > 1000) locationHistory.shift();
  res.send('OK');
});

// GET endpoint: Latest location
app.get('/location', (req, res) => {
  if (locationHistory.length === 0) return res.json({});
  res.json(locationHistory[locationHistory.length - 1]);
});

// GET endpoint: All history
app.get('/history', (req, res) => {
  res.json(locationHistory);
});

// Health check
app.get('/', (req, res) => {
  res.send('GPS Tracker Backend is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Minimal Express server to serve a static Vue-like demo app
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // default to 3000 to avoid conflicts with common services

app.use(express.static(path.join(__dirname, 'public')));

// fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`NovaTrack demo server running at http://localhost:${port}`);
});

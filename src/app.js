require('dotenv').config();
const express = require('express');
const shortenRoutes = require('./routes/shorten.routes');
const statsRoutes = require('./routes/stats.routes');
const redirectRoutes = require('./routes/redirect.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Shortly',
    description: 'URL Shortener API with click analytics',
    endpoints: {
      health: 'GET /health',
      shorten: 'POST /api/shorten',
      redirect: 'GET /:shortCode',
      stats: 'GET /api/stats/:shortCode',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/shorten', shortenRoutes);
app.use('/api/stats', statsRoutes);
app.use('/', redirectRoutes);

app.use(errorHandler);

module.exports = app;

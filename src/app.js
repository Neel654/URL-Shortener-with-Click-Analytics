require('dotenv').config();
const express = require('express');
const shortenRoutes = require('./routes/shorten.routes');
const statsRoutes = require('./routes/stats.routes');
const redirectRoutes = require('./routes/redirect.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/shorten', shortenRoutes);
app.use('/api/stats', statsRoutes);
app.use('/', redirectRoutes);

app.use(errorHandler);

module.exports = app;

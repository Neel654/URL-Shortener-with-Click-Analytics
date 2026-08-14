const urlService = require('../services/url.service');

async function shorten(req, res, next) {
  try {
    const { longUrl } = req.body;
    const result = await urlService.shorten(longUrl);
    res.status(201).location(result.shortUrl).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { shorten };

const clickService = require('../services/click.service');

async function getStats(req, res, next) {
  try {
    const { shortCode } = req.params;
    const stats = await clickService.getStats(shortCode);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };

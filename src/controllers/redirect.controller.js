const clickService = require('../services/click.service');

async function redirect(req, res, next) {
  try {
    const { shortCode } = req.params;
    const referrer = req.get('referer') || req.get('referrer') || null;
    const userAgent = req.get('user-agent') || null;

    const longUrl = await clickService.recordClick(shortCode, referrer, userAgent);
    res.redirect(302, longUrl);
  } catch (err) {
    next(err);
  }
}

module.exports = { redirect };

const clickRepository = require('../db/click.repository');
const urlService = require('./url.service');
const { NotFoundError } = require('../utils/errors');

async function recordClick(shortCode, referrer, userAgent) {
  const url = await urlService.getLongUrl(shortCode);
  if (!url) {
    throw new NotFoundError('Short code not found');
  }

  await clickRepository.logClick(url.id, referrer, userAgent);
  return url.long_url;
}

async function getStats(shortCode) {
  const url = await urlService.getLongUrl(shortCode);
  if (!url) {
    throw new NotFoundError('Short code not found');
  }

  const stats = await clickRepository.getStatsByUrlId(url.id);

  return {
    shortCode: url.short_code,
    longUrl: url.long_url,
    ...stats,
  };
}

module.exports = { recordClick, getStats };

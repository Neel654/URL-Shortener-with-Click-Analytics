const urlRepository = require('../db/url.repository');
const { assertValidUrl } = require('../utils/validateUrl');

function buildShortUrl(shortCode) {
  const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${baseUrl}/${shortCode}`;
}

async function shorten(longUrl) {
  assertValidUrl(longUrl);
  const url = await urlRepository.createUrl(longUrl.trim());
  return {
    shortCode: url.shortCode,
    shortUrl: buildShortUrl(url.shortCode),
    longUrl: url.longUrl,
  };
}

async function getLongUrl(shortCode) {
  const url = await urlRepository.findByShortCode(shortCode);
  return url;
}

module.exports = { shorten, getLongUrl, buildShortUrl };

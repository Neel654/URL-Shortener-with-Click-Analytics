const { BadRequestError } = require('./errors');

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function assertValidUrl(value) {
  if (!value || typeof value !== 'string') {
    throw new BadRequestError('longUrl is required');
  }
  if (!isValidUrl(value)) {
    throw new BadRequestError('longUrl must be a valid http or https URL');
  }
}

module.exports = { isValidUrl, assertValidUrl };

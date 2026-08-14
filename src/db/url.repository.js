const crypto = require('crypto');
const pool = require('./pool');
const { toBase62 } = require('../utils/base62');

async function createUrl(longUrl) {
  const placeholder = crypto.randomBytes(4).toString('hex');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO urls (long_url, short_code)
       VALUES ($1, $2)
       RETURNING id, long_url, created_at`,
      [longUrl, placeholder]
    );

    const { id, long_url, created_at } = insertResult.rows[0];
    const shortCode = toBase62(id);

    await client.query(
      'UPDATE urls SET short_code = $1 WHERE id = $2',
      [shortCode, id]
    );

    await client.query('COMMIT');

    return { id, shortCode, longUrl: long_url, createdAt: created_at };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function findByShortCode(shortCode) {
  const result = await pool.query(
    `SELECT id, short_code, long_url, created_at
     FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );
  return result.rows[0] || null;
}

module.exports = { createUrl, findByShortCode };

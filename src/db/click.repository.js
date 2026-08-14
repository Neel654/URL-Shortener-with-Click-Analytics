const pool = require('./pool');

async function logClick(urlId, referrer, userAgent) {
  await pool.query(
    `INSERT INTO clicks (url_id, referrer, user_agent)
     VALUES ($1, $2, $3)`,
    [urlId, referrer || null, userAgent || null]
  );
}

async function getStatsByUrlId(urlId) {
  const totalResult = await pool.query(
    'SELECT COUNT(*)::int AS total FROM clicks WHERE url_id = $1',
    [urlId]
  );

  const dailyResult = await pool.query(
    `SELECT DATE(clicked_at AT TIME ZONE 'UTC') AS date,
            COUNT(*)::int AS count
     FROM clicks
     WHERE url_id = $1
     GROUP BY DATE(clicked_at AT TIME ZONE 'UTC')
     ORDER BY date DESC`,
    [urlId]
  );

  const referrersResult = await pool.query(
    `SELECT COALESCE(NULLIF(referrer, ''), '(direct)') AS referrer,
            COUNT(*)::int AS count
     FROM clicks
     WHERE url_id = $1
     GROUP BY COALESCE(NULLIF(referrer, ''), '(direct)')
     ORDER BY count DESC
     LIMIT 10`,
    [urlId]
  );

  return {
    totalClicks: totalResult.rows[0].total,
    clicksByDay: dailyResult.rows.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      count: row.count,
    })),
    topReferrers: referrersResult.rows.map((row) => ({
      referrer: row.referrer,
      count: row.count,
    })),
  };
}

module.exports = { logClick, getStatsByUrlId };

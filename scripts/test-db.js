require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing from .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const result = await pool.query('SELECT NOW() AS connected_at, current_database() AS database');
    console.log('✅ Connected to PostgreSQL');
    console.log(`   Database: ${result.rows[0].database}`);
    console.log(`   Server time: ${result.rows[0].connected_at}`);

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('urls', 'clicks')
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('⚠️  Connected, but urls/clicks tables not found — run db/schema.sql in Neon');
    } else {
      console.log(`   Tables found: ${tables.rows.map((r) => r.table_name).join(', ')}`);
    }
  } catch (err) {
    console.error('❌ Connection failed');
    console.error(`   ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();

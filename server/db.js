const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'grandline',
  user: process.env.DB_USER || 'grandline_user',
  password: process.env.DB_PASS || 'grandline123',
  port: process.env.DB_PORT || 5432,
})

module.exports = pool

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // username: "admin",
  // password: "password",
  // database: "admin"
  // ssl: true,
})

module.exports = {
  pool,
}

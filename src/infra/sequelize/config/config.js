// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  development: {
    database: process.env.DB_DEV_NAME,
    username: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASSWORD,
    host: process.env.DB_DEV_HOST,
    dialect: process.env.DB_DEV_DIALECT,
    logging: false
  },
  test: {
    database: process.env.DB_TEST_NAME,
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    host: process.env.DB_TEST_HOST,
    dialect: process.env.DB_TEST_DIALECT,
    logging: false
  },
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
}

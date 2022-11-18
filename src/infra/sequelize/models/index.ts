import { Sequelize } from 'sequelize-typescript'

const env = process.env.NODE_ENV ?? 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(__dirname + '../config/config.js')[env]

const sequelize = config.uri ? new Sequelize(config.uri, config) : new Sequelize(config.database, config.username, config.password, config)

export default { Sequelize, sequelize }

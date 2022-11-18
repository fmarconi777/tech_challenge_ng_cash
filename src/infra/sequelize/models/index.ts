import { Sequelize } from 'sequelize-typescript'
import configData from '../config/config'

const env = process.env.NODE_ENV ?? 'development'
const data = configData as any
const config = data[env]

const sequelize = config.uri ? new Sequelize(config.uri, config) : new Sequelize(config.database, config.username, config.password, config)

export default { Sequelize, sequelize }

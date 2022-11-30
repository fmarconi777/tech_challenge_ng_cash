import connection from '@/infra/sequelize/models/index'
import { Sequelize } from 'sequelize'

const sequelizeClient = connection.sequelize

export const ConnectionHelper = {
  client: null as unknown as Sequelize,

  environment: '',

  async connect (env: string): Promise<void> {
    this.environment = env
    process.env.NODE_ENV = env
    this.client = sequelizeClient
    await this.client.authenticate()
  },

  async disconnect (): Promise<void> {
    if (this.client !== null) {
      await this.client.close()
    }
    this.client = null as unknown as Sequelize
  },

  async reconnect (): Promise<void> {
    if (!this.client?.authenticate()) { // eslint-disable-line
      await this.connect(this.environment)
    }
  }
}

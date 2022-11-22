import request from 'supertest'
import app from '../config/app'
import { ConnectionHelper } from '../../infra/db/helpers/connection-helper'
import { Accounts } from '../../infra/sequelize/models/accounts'
import { Users } from '../../infra/sequelize/models/users'

describe('Balance Routes', () => {
  beforeAll(async () => {
    await ConnectionHelper.connect('test')
  })

  beforeEach(async () => {
    await Users.destroy({
      where: {},
      truncate: true,
      cascade: true
    })
    await Accounts.destroy({
      where: {},
      truncate: true,
      cascade: true
    })
  })

  afterAll(async () => {
    await ConnectionHelper.disconnect()
  })

  test('Should return 403 on get balance without accessToken', async () => {
    await request(app)
      .get('/balance')
      .expect(403)
  })
})

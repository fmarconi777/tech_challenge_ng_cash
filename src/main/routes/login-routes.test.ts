import request from 'supertest'
import { ConnectionHelper } from '../../infra/db/helpers/connection-helper'
import { Accounts } from '../../infra/sequelize/models/accounts'
import { Users } from '../../infra/sequelize/models/users'
import app from '../config/app'

describe('Login Routes', () => {
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

  test('Should return a 200 on login', async () => {
    await request(app).post('/signup').send({
      username: 'anyName',
      password: 'anyPassword1'
    })
    await request(app)
      .post('/login')
      .send({
        username: 'anyName',
        password: 'anyPassword1'
      })
      .expect(200)
  })
})

import app from '../config/app'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Accounts } from '@/infra/sequelize/models/accounts'
import { Users } from '@/infra/sequelize/models/users'
import request from 'supertest'

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

  test('Should return 401 if user does not exist', async () => {
    await request(app)
      .post('/login')
      .send({
        username: 'invalidName',
        password: 'anyPassword1'
      })
      .expect(401)
  })
})

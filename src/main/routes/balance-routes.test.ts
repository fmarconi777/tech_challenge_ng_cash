import app from '../config/app'
import { makeLoginController } from '../factories/login/login'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Accounts } from '@/infra/sequelize/models/accounts'
import { Users } from '@/infra/sequelize/models/users'
import request from 'supertest'

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

  test('Should return 200 on get balance with valid accessToken', async () => {
    await request(app).post('/signup').send({
      username: 'anyName',
      password: 'anyPassword1'
    })
    const login = makeLoginController()
    const httpResponse = await login.handle({
      body: {
        username: 'anyName',
        password: 'anyPassword1'
      },
      method: 'POST'
    })
    await request(app)
      .get('/balance')
      .set('authorization', `Bearer ${((httpResponse).body as string)}`)
      .expect(200)
  })
})

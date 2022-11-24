import { ConnectionHelper } from '../../infra/db/helpers/connection-helper'
import { Accounts } from '../../infra/sequelize/models/accounts'
import { Transactions } from '../../infra/sequelize/models/transactions'
import { Users } from '../../infra/sequelize/models/users'
import request from 'supertest'
import app from '../config/app'
import { makeLoginController } from '../factories/login'

describe('Transaction Routes', () => {
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
    await Transactions.destroy({
      where: {},
      truncate: true,
      cascade: true
    })
  })

  afterAll(async () => {
    await ConnectionHelper.disconnect()
  })

  test('Should return 403 on post transaction without accessToken', async () => {
    await request(app)
      .post('/transaction')
      .send({
        creditedUsername: 'anyName2',
        value: '100.00'
      })
      .expect(403)
  })

  test('Should return 200 on post transaction with valid accessToken', async () => {
    await request(app).post('/signup').send({
      username: 'anyName',
      password: 'anyPassword1'
    })
    await request(app).post('/signup').send({
      username: 'anyName2',
      password: 'anyPassword1'
    })
    const login = makeLoginController()
    const httpResponse = await login.handle({
      body: {
        username: 'anyName',
        password: 'anyPassword1'
      }
    })
    await request(app)
      .post('/transaction')
      .set('authorization', `Bearer ${((httpResponse).body as string)}`)
      .send({
        creditedUsername: 'anyName2',
        value: '100.00'
      })
      .expect(200)
  })
})

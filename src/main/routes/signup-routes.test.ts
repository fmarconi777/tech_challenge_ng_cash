import app from '../config/app'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Accounts } from '@/infra/sequelize/models/accounts'
import { Users } from '@/infra/sequelize/models/users'
import request from 'supertest'

describe('Signup Routes', () => {
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

  test('Should return a message on success', async () => {
    await request(app)
      .post('/signup')
      .send({
        username: 'anyName',
        password: 'anyPassword1'
      })
      .expect(201)
  })
})

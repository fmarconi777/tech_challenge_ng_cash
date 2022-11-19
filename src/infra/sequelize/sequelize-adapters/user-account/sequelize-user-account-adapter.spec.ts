import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { SequelizeUserAccountAdapter } from './sequelize-user-account-adapter'

const userData = {
  username: 'valid_username',
  password: 'hashed_password'
}

describe('SequelizeUserAccount Adapter', () => {
  beforeAll(async () => {
    await ConnectionHelper.connect('test')
  })

  afterAll(async () => {
    await ConnectionHelper.disconnect()
  })

  test('Should return a message on success', async () => {
    const sut = new SequelizeUserAccountAdapter()
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toBe('Account succesfully created')
  })
})

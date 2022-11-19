import { Sequelize } from 'sequelize'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { Accounts } from '../../models/accounts'
import { Users } from '../../models/users'
import { SequelizeUserAccountAdapter } from './sequelize-user-account-adapter'

const userData = {
  username: 'valid_username',
  password: 'hashed_password'
}

describe('SequelizeUserAccount Adapter', () => {
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
    const sut = new SequelizeUserAccountAdapter()
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toBe('Account succesfully created')
  })

  test('Should reconnect if connection is lost', async () => {
    ConnectionHelper.client = null as unknown as Sequelize
    const sut = new SequelizeUserAccountAdapter()
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toBe('Account succesfully created')
  })

  test('Should throw if ORM throws', async () => {
    const sut = new SequelizeUserAccountAdapter()
    const userAccount = sut.addUserAccount({
      username: 'valid_username',
      password: null as unknown as string
    })
    await expect(userAccount).rejects.toThrow()
  })
})

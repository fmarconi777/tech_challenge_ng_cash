import { SequelizeUserAdapter } from '../user/sequelize-user-adapter'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { SequelizeUserAccountAdapter } from '../user-account/sequelize-user-account-adapter'
import { Users } from '../../models/users'
import { Sequelize } from 'sequelize'
import { Accounts } from '../../models/accounts'

describe('SequelizeUser Adapter', () => {
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

  test('Should return null if user does not exist', async () => {
    const sut = new SequelizeUserAdapter()
    const user = await sut.checkByUsername('invalid_username')
    expect(user).toBeNull()
  })

  test('Should return an user on success', async () => {
    const sut = new SequelizeUserAdapter()
    const sequelizeUserAccount = new SequelizeUserAccountAdapter()
    await sequelizeUserAccount.addUserAccount({ username: 'valid_username', password: 'hashed_password' })
    const user = await sut.checkByUsername('valid_username')
    expect(user).toBeTruthy()
    expect(user?.id).toBeTruthy()
    expect(user?.accountId).toBeTruthy()
    expect(user?.username).toBe('valid_username')
    expect(user?.password).toBe('hashed_password')
  })

  test('Should reconnect if connection is lost', async () => {
    ConnectionHelper.client = null as unknown as Sequelize
    const sut = new SequelizeUserAdapter()
    const sequelizeUserAccount = new SequelizeUserAccountAdapter()
    await sequelizeUserAccount.addUserAccount({ username: 'valid_username', password: 'hashed_password' })
    const user = await sut.checkByUsername('valid_username')
    expect(user).toBeTruthy()
    expect(user?.id).toBeTruthy()
    expect(user?.accountId).toBeTruthy()
    expect(user?.username).toBe('valid_username')
    expect(user?.password).toBe('hashed_password')
  })
})

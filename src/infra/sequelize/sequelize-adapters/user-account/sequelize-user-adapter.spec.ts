import { SequelizeUserAdapter } from './sequelize-user-adapter'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { SequelizeUserAccountAdapter } from './sequelize-user-account-adapter'
import { Users } from '../../models/users'

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
})

import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { Accounts } from '../../models/accounts'
import { Users } from '../../models/users'
import { SequelizeUserAccountAdapter } from '../user-account/sequelize-user-account-adapter'
import { SequelizeAccountAdapter } from './sequelize-account-adapter'

describe('SequelizeAccount Adapter', () => {
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

  test('Should return null if account does not exist', async () => {
    const sut = new SequelizeAccountAdapter()
    const account = await sut.loadById(158922357855)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const sut = new SequelizeAccountAdapter()
    const sequelizeUserAccount = new SequelizeUserAccountAdapter()
    await sequelizeUserAccount.addUserAccount({ username: 'valid_username', password: 'hashed_password' })
    const lastAccount = ((await Accounts.findAll())[0])
    const account = await sut.loadById(lastAccount.id)
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.balance).toEqual('100.00')
  })
})

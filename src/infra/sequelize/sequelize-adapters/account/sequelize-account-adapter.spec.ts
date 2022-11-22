import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { Accounts } from '../../models/accounts'
import { Users } from '../../models/users'
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
    const user = await sut.loadById(158922357855)
    expect(user).toBeNull()
  })
})

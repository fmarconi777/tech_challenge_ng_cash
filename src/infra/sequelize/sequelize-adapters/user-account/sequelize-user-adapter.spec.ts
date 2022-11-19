import { SequelizeUserAdapter } from './sequelize-user-adapter'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'

describe('SequelizeUser Adapter', () => {
  beforeAll(async () => {
    await ConnectionHelper.connect('test')
  })

  afterAll(async () => {
    await ConnectionHelper.disconnect()
  })

  test('Should return null if user does not exist', async () => {
    const sut = new SequelizeUserAdapter()
    const user = await sut.checkByUsername('invalid_username')
    expect(user).toBeNull()
  })
})

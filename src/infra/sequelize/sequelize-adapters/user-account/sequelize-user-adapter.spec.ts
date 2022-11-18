import { SequelizeUserAdapter } from './sequelize-user-adapter'
import connection from '../../models/index'

describe('SequelizeUser Adapter', () => {
  beforeAll(async () => {
    await connection.sequelize.authenticate()
  })

  afterAll(async () => {
    await connection.sequelize.close()
  })

  test('Should return null if user does not exist', async () => {
    const sut = new SequelizeUserAdapter()
    const user = await sut.checkByUsername('invalid_username')
    expect(user).toBeNull()
  })
})

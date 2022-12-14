import { SequelizeUserAdapter } from '../user/sequelize-user-adapter'
import { SequelizeUserAccountAdapter } from '../user-account/sequelize-user-account-adapter'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Users, Accounts } from '@/infra/sequelize/models/models'
import { Sequelize } from 'sequelize'

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

  describe('loadByUsername', () => {
    test('Should return null if user does not exist', async () => {
      const sut = new SequelizeUserAdapter()
      const user = await sut.loadByUsername('invalid_username')
      expect(user).toBeNull()
    })

    test('Should return an user on success', async () => {
      const sut = new SequelizeUserAdapter()
      const sequelizeUserAccount = new SequelizeUserAccountAdapter()
      await sequelizeUserAccount.addUserAccount({ username: 'valid_username', password: 'hashed_password' })
      const user = await sut.loadByUsername('valid_username')
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
      const user = await sut.loadByUsername('valid_username')
      expect(user).toBeTruthy()
      expect(user?.id).toBeTruthy()
      expect(user?.accountId).toBeTruthy()
      expect(user?.username).toBe('valid_username')
      expect(user?.password).toBe('hashed_password')
    })
  })

  describe('loadById', () => {
    test('Should return null if user does not exist', async () => {
      const sut = new SequelizeUserAdapter()
      const user = await sut.loadById(1)
      expect(user).toBeNull()
    })

    test('Should return an user on success', async () => {
      const sut = new SequelizeUserAdapter()
      const sequelizeUserAccount = new SequelizeUserAccountAdapter()
      await sequelizeUserAccount.addUserAccount({ username: 'valid_username', password: 'hashed_password' })
      const lastUser = ((await Users.findAll())[0])
      const user = await sut.loadById(lastUser.id)
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
      const lastUser = ((await Users.findAll())[0])
      const user = await sut.loadById(lastUser.id)
      expect(user).toBeTruthy()
      expect(user?.id).toBeTruthy()
      expect(user?.accountId).toBeTruthy()
      expect(user?.username).toBe('valid_username')
      expect(user?.password).toBe('hashed_password')
    })
  })
})

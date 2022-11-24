import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { Accounts } from '../../models/accounts'
import { Transactions } from '../../models/transactions'
import { Users } from '../../models/users'
import { SequelizeTransactionAdapter } from './sequelize-transaction-adapter'
import { SequelizeUserAccountAdapter } from '../user-account/sequelize-user-account-adapter'
import { Sequelize } from 'sequelize'

describe('Sequelize Tansaction Adapter', () => {
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
    await Transactions.destroy({
      where: {},
      truncate: true,
      cascade: true
    })
  })

  afterAll(async () => {
    await ConnectionHelper.disconnect()
  })

  test('Should return a message on success', async () => {
    const sut = new SequelizeTransactionAdapter()
    const creatUserAccount = new SequelizeUserAccountAdapter()
    await creatUserAccount.addUserAccount({
      username: 'valid_username',
      password: 'hashed_password'
    })
    await creatUserAccount.addUserAccount({
      username: 'valid_username2',
      password: 'hashed_password'
    })
    const users = await Users.findAll()
    const recordData = {
      debitedAccountId: users[0].accountId,
      debitedBalance: 0.00,
      creditedAccountId: users[1].accountId,
      creditedBalance: 200.00,
      value: 100.00
    }
    const record = await sut.record(recordData)
    expect(record).toBe('Transaction succesfully recorded')
  })

  test('Should reconnect if connection is lost', async () => {
    ConnectionHelper.client = null as unknown as Sequelize
    const sut = new SequelizeTransactionAdapter()
    const creatUserAccount = new SequelizeUserAccountAdapter()
    await creatUserAccount.addUserAccount({
      username: 'valid_username',
      password: 'hashed_password'
    })
    await creatUserAccount.addUserAccount({
      username: 'valid_username2',
      password: 'hashed_password'
    })
    const users = await Users.findAll()
    const recordData = {
      debitedAccountId: users[0].accountId,
      debitedBalance: 0.00,
      creditedAccountId: users[1].accountId,
      creditedBalance: 200.00,
      value: 100.00
    }
    const record = await sut.record(recordData)
    expect(record).toBe('Transaction succesfully recorded')
  })
})

import { SequelizeTransactionAdapter } from './sequelize-transaction-adapter'
import { SequelizeUserAccountAdapter } from '../user-account/sequelize-user-account-adapter'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Accounts, Users, Transactions } from '@/infra/sequelize/models/models'
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

  describe('record method', () => {
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

    test('Should throw if ORM throws', async () => {
      const sut = new SequelizeTransactionAdapter()
      const recordData = {
        debitedAccountId: 1,
        debitedBalance: 0.00,
        creditedAccountId: 1,
        creditedBalance: 200.00,
        value: null as unknown as number
      }
      const record = sut.record(recordData)
      await expect(record).rejects.toThrow()
    })
  })

  describe('LoadByAccountId method', () => {
    test('Should return an array of records on success', async () => {
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
      await sut.record(recordData)
      const loadedRecords = await sut.loadByAccountId(users[0].accountId)
      expect(loadedRecords.length).toBeGreaterThan(0)
      expect(loadedRecords[0].id).toBeTruthy()
      expect(loadedRecords[0].debitedUsername).toBe('valid_username')
      expect(loadedRecords[0].creditedUsername).toBe('valid_username2')
      expect(loadedRecords[0].value).toBe('100.00')
      expect(loadedRecords[0].createdAt).toBeTruthy()
    })
  })

  describe('loadByCashFilter method', () => {
    test('Should return an array of records on success', async () => {
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
      await sut.record(recordData)
      const loadedRecords = await sut.loadByCashFilter({
        accountId: users[0].accountId,
        filter: 'debitedAccountId'
      })
      expect(loadedRecords.length).toBeGreaterThan(0)
      expect(loadedRecords[0].id).toBeTruthy()
      expect(loadedRecords[0].debitedUsername).toBe('valid_username')
      expect(loadedRecords[0].creditedUsername).toBe('valid_username2')
      expect(loadedRecords[0].value).toBe('100.00')
      expect(loadedRecords[0].createdAt).toBeTruthy()
    })
  })

  describe('loadByFilterDate method', () => {
    test('Should return an array of records on success', async () => {
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
      await sut.record(recordData)
      const loadedRecords = await sut.loadByFilterDate({
        accountId: users[0].accountId,
        startDate: '2022-01-01',
        endDate: '2023-12-31'
      })
      expect(loadedRecords.length).toBeGreaterThan(0)
      expect(loadedRecords[0].id).toBeTruthy()
      expect(loadedRecords[0].debitedUsername).toBe('valid_username')
      expect(loadedRecords[0].creditedUsername).toBe('valid_username2')
      expect(loadedRecords[0].value).toBe('100.00')
      expect(loadedRecords[0].createdAt).toBeTruthy()
    })
  })
})

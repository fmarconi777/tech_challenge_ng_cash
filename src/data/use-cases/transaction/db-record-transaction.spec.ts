import { AccountModel } from '../../../domain/models/account'
import { UserModel } from '../../../domain/models/user'
import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { RecordData, RecordTransactionRepository } from '../../protocols/db/transaction/record-transaction-repository'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'
import { DbRecordTransaction } from './db-record-transaction'

const transactionData = {
  debitedUsername: 'any_username',
  creditedUsername: 'some_username',
  value: '100.00'
}

const fakeUser = {
  id: 'any_id',
  username: 'any_username',
  password: 'any_password',
  accountId: '1'
}

const fakeAccount = {
  id: '1',
  balance: '100.00'
}

const makeLoadUserByUsernameRepositoryStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
    async loadByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByUsernameRepositoryStub()
}

const makeLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: number): Promise<AccountModel | null> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

const makeRecordTransactionRepositoryStub = (): RecordTransactionRepository => {
  class RecordTransactionRepositoryStub implements RecordTransactionRepository {
    async record (recordData: RecordData): Promise<string> {
      return await Promise.resolve('Transaction succesfully recorded')
    }
  }
  return new RecordTransactionRepositoryStub()
}

type SubTypes = {
  sut: DbRecordTransaction
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
  recordTransactionRepositoryStub: RecordTransactionRepository
}

const makeSut = (): SubTypes => {
  const recordTransactionRepositoryStub = makeRecordTransactionRepositoryStub()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const sut = new DbRecordTransaction(loadUserByUsernameRepositoryStub, loadAccountByIdRepositoryStub, recordTransactionRepositoryStub)
  return {
    sut,
    loadUserByUsernameRepositoryStub,
    loadAccountByIdRepositoryStub,
    recordTransactionRepositoryStub
  }
}

describe('DbRecordTransaction', () => {
  test('Should call LoadUserByUsernameRepository with correct value', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername')
    await sut.record(transactionData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith('some_username')
  })

  test('Should throw if LoadUserByUsernameRepository throws', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername').mockReturnValueOnce(Promise.reject(new Error()))
    const record = sut.record(transactionData)
    await expect(record).rejects.toThrow()
  })

  test('Should return a Record if LoadUserByUsernameRepository returns null', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername').mockReturnValueOnce(Promise.resolve(null))
    const record = await sut.record(transactionData)
    expect(record).toEqual({
      recorded: false,
      message: 'Invalid creditedUsername'
    })
  })

  test('Should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.record(transactionData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith(1)
  })

  test('Should return a Record if debitedAccount have insufficient balance', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve({ id: '1', balance: '0.00' }))
    const record = await sut.record(transactionData)
    expect(record).toEqual({
      recorded: false,
      message: 'Insufficient balance'
    })
  })

  test('Should call RecordTransactionRepository with correct values', async () => {
    const { sut, recordTransactionRepositoryStub } = makeSut()
    const recordSpy = jest.spyOn(recordTransactionRepositoryStub, 'record')
    await sut.record(transactionData)
    expect(recordSpy).toHaveBeenCalledWith({
      debitedAccountId: 1,
      debitBalance: 0.00,
      creditedAccountId: 1,
      creditBalance: 200.00,
      value: 100.00
    })
  })

  test('Should throw if RecordTransactionRepository throws', async () => {
    const { sut, recordTransactionRepositoryStub } = makeSut()
    jest.spyOn(recordTransactionRepositoryStub, 'record').mockReturnValueOnce(Promise.reject(new Error()))
    const record = sut.record(transactionData)
    await expect(record).rejects.toThrow()
  })
})

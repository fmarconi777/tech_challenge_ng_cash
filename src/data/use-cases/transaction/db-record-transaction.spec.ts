import { AccountModel } from '../../../domain/models/account'
import { UserModel } from '../../../domain/models/user'
import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'
import { DbRecordTransaction } from './db-record-transaction'

const transactionData = {
  cashOutUsername: 'any_username',
  cashInUsername: 'some_username',
  credit: '100.00'
}

const fakeUser = {
  id: '1',
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

type SubTypes = {
  sut: DbRecordTransaction
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SubTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const sut = new DbRecordTransaction(loadUserByUsernameRepositoryStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    loadUserByUsernameRepositoryStub,
    loadAccountByIdRepositoryStub
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
      message: 'Invalid cashInUsername'
    })
  })

  test('Should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.record(transactionData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith(1)
  })

  test('Should return a Record if cashOutAccount have insufficient balance', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve({ id: '1', balance: '0.00' }))
    const record = await sut.record(transactionData)
    expect(record).toEqual({
      recorded: false,
      message: 'Insufficient balance'
    })
  })
})

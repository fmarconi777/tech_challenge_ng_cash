import { UserModel } from '../../../../domain/models/user'
import { FilterValues, LoadFilteredCashTransactionsRepository, RecordsData } from '../../../protocols/db/transaction/load-filtered-cash-transactions-repository'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'
import { DbLoadFilteredCashTransactions } from './db-load-filtered-cash-transactions'

const filterData = {
  userId: 1,
  filter: 'any_param'
}

const fakeUser = {
  id: '1',
  username: 'any_username',
  password: 'any_password',
  accountId: '1'
}

const makeLoadUserByIdRepositoryStub = (): LoadUserByIdRepository => {
  class LoadUserByIdRepositoryStub implements LoadUserByIdRepository {
    async loadById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByIdRepositoryStub()
}

const makeLoadFilteredCashTransactionsRepositoryStub = (): LoadFilteredCashTransactionsRepository => {
  class LoadFilteredCashTransactionsRepositoryStub implements LoadFilteredCashTransactionsRepository {
    async loadByFilter (filterValues: FilterValues): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadFilteredCashTransactionsRepositoryStub()
}

type SubTypes = {
  sut: DbLoadFilteredCashTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadFilteredCashTransactionsRepositoryStub: LoadFilteredCashTransactionsRepository
}

const makeSut = (): SubTypes => {
  const loadFilteredCashTransactionsRepositoryStub = makeLoadFilteredCashTransactionsRepositoryStub()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadFilteredCashTransactions(loadUserByIdRepositoryStub, loadFilteredCashTransactionsRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadFilteredCashTransactionsRepositoryStub
  }
}

describe('DbLoadFilteredCashTransactions', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.load(filterData)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.load(filterData)
    await expect(records).rejects.toThrow()
  })

  test('Should call LoadFilteredCashTransactionsRepository with correct values', async () => {
    const { sut, loadFilteredCashTransactionsRepositoryStub } = makeSut()
    const loadByFilterdSpy = jest.spyOn(loadFilteredCashTransactionsRepositoryStub, 'loadByFilter')
    await sut.load(filterData)
    expect(loadByFilterdSpy).toHaveBeenCalledWith({
      accountId: 1,
      filter: 'any_param'
    })
  })

  test('Should throw if LoadFilteredCashTransactionsRepository throws', async () => {
    const { sut, loadFilteredCashTransactionsRepositoryStub } = makeSut()
    jest.spyOn(loadFilteredCashTransactionsRepositoryStub, 'loadByFilter').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.load(filterData)
    await expect(records).rejects.toThrow()
  })
})

import { FilterValues, LoadFilterByCashTransactionsRepository, RecordsData, LoadUserByIdRepository } from './db-load-filter-by-cash-transactions-protocols'
import { DbLoadFilterByCashTransactions } from './db-load-filter-by-cash-transactions'
import { UserModel } from '@/domain/models/user'

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

const makeLoadFilterByCashTransactionsRepositoryStub = (): LoadFilterByCashTransactionsRepository => {
  class LoadFilterByCashTransactionsRepositoryStub implements LoadFilterByCashTransactionsRepository {
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
  return new LoadFilterByCashTransactionsRepositoryStub()
}

type SubTypes = {
  sut: DbLoadFilterByCashTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadFilterByCashTransactionsRepositoryStub: LoadFilterByCashTransactionsRepository
}

const makeSut = (): SubTypes => {
  const loadFilterByCashTransactionsRepositoryStub = makeLoadFilterByCashTransactionsRepositoryStub()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadFilterByCashTransactions(loadUserByIdRepositoryStub, loadFilterByCashTransactionsRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadFilterByCashTransactionsRepositoryStub
  }
}

describe('DbLoadFilterByCashTransactions', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.loadByCash(filterData)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.loadByCash(filterData)
    await expect(records).rejects.toThrow()
  })

  test('Should call LoadFilterByCashTransactionsRepository with correct values', async () => {
    const { sut, loadFilterByCashTransactionsRepositoryStub } = makeSut()
    const loadByFilterdSpy = jest.spyOn(loadFilterByCashTransactionsRepositoryStub, 'loadByFilter')
    await sut.loadByCash(filterData)
    expect(loadByFilterdSpy).toHaveBeenCalledWith({
      accountId: 1,
      filter: 'any_param'
    })
  })

  test('Should throw if LoadFilterByCashTransactionsRepository throws', async () => {
    const { sut, loadFilterByCashTransactionsRepositoryStub } = makeSut()
    jest.spyOn(loadFilterByCashTransactionsRepositoryStub, 'loadByFilter').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.loadByCash(filterData)
    await expect(records).rejects.toThrow()
  })

  test('Should return an array of records on success', async () => {
    const { sut } = makeSut()
    const records = await sut.loadByCash(filterData)
    expect(records).toEqual([{
      id: 'any_id',
      debitedUsername: 'any_debitedUsername',
      creditedUsername: 'any_creditedUsername',
      value: 'any_value',
      createdAt: 'any_createdAt'
    }])
  })
})

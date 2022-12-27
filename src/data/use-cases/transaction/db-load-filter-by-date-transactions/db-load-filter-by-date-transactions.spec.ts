import { UserModel, LoadFilterByDateTransactionsRepository, PeriodData, RecordsData, LoadUserByIdRepository } from './db-load-filter-by-date-transactions-protocols'
import { DbLoadFilterByDateTransactions } from './db-load-filter-by-date-transactions'

const timePeriod = {
  userId: 1,
  startDate: '2022-01-01',
  endDate: '2022-11-01'
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

const makeLoadFilterByDateTransactionsRepositoryStub = (): LoadFilterByDateTransactionsRepository => {
  class LoadFilterByDateTransactionsRepositoryStub implements LoadFilterByDateTransactionsRepository {
    async loadByFilterDate (periodData: PeriodData): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadFilterByDateTransactionsRepositoryStub()
}

type SutTypes = {
  sut: DbLoadFilterByDateTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadFilterByDateTransactionsRepositoryStub: LoadFilterByDateTransactionsRepository
}

const makeSut = (): SutTypes => {
  const loadFilterByDateTransactionsRepositoryStub = makeLoadFilterByDateTransactionsRepositoryStub()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadFilterByDateTransactions(loadUserByIdRepositoryStub, loadFilterByDateTransactionsRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadFilterByDateTransactionsRepositoryStub
  }
}

describe('DbLoadFilterByDateTransactions', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.loadByDate(timePeriod)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.loadByDate(timePeriod)
    await expect(records).rejects.toThrow()
  })

  test('Should call LoadFilterByDateTransactionsRepository with correct values', async () => {
    const { sut, loadFilterByDateTransactionsRepositoryStub } = makeSut()
    const loadByFilterDatedSpy = jest.spyOn(loadFilterByDateTransactionsRepositoryStub, 'loadByFilterDate')
    await sut.loadByDate(timePeriod)
    expect(loadByFilterDatedSpy).toHaveBeenCalledWith({
      accountId: 1,
      startDate: '2022-01-01',
      endDate: '2022-11-01'
    })
  })

  test('Should throw if LoadFilterByDateTransactionsRepository throws', async () => {
    const { sut, loadFilterByDateTransactionsRepositoryStub } = makeSut()
    jest.spyOn(loadFilterByDateTransactionsRepositoryStub, 'loadByFilterDate').mockReturnValueOnce(Promise.reject(new Error()))
    const records = sut.loadByDate(timePeriod)
    await expect(records).rejects.toThrow()
  })

  test('Should return an array of records on success', async () => {
    const { sut } = makeSut()
    const records = await sut.loadByDate(timePeriod)
    expect(records).toEqual([{
      id: 'any_id',
      debitedUsername: 'any_debitedUsername',
      creditedUsername: 'any_creditedUsername',
      value: 'any_value',
      createdAt: 'any_createdAt'
    }])
  })
})

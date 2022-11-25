import { UserModel } from '../../../../domain/models/user'
import { LoadTransactionsByAccountIdRepository, RecordsData, LoadUserByIdRepository } from './db-load-trasactions-protocols'
import { DbLoadTransactions } from './db-load-transactions'

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

const makeLoadTransactionsByAccountIdRepository = (): LoadTransactionsByAccountIdRepository => {
  class LoadTransactionsByAccountIdRepository implements LoadTransactionsByAccountIdRepository {
    async loadByAccountId (id: number): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadTransactionsByAccountIdRepository()
}

type SubTypes = {
  sut: DbLoadTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadTransactionsByAccountIdRepository: LoadTransactionsByAccountIdRepository
}

const makeSut = (): SubTypes => {
  const loadTransactionsByAccountIdRepository = makeLoadTransactionsByAccountIdRepository()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadTransactions(loadUserByIdRepositoryStub, loadTransactionsByAccountIdRepository)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadTransactionsByAccountIdRepository
  }
}

describe('DbLoadTransactions', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.load(1)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load(1)
    await expect(user).rejects.toThrow()
  })

  test('Should call LoadTransactionsByAccountIdRepository with correct value', async () => {
    const { sut, loadTransactionsByAccountIdRepository } = makeSut()
    const loadByAccountIddSpy = jest.spyOn(loadTransactionsByAccountIdRepository, 'loadByAccountId')
    await sut.load(1)
    expect(loadByAccountIddSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadTransactionsByAccountIdRepository throws', async () => {
    const { sut, loadTransactionsByAccountIdRepository } = makeSut()
    jest.spyOn(loadTransactionsByAccountIdRepository, 'loadByAccountId').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load(1)
    await expect(user).rejects.toThrow()
  })

  test('Should return an array of records on success', async () => {
    const { sut } = makeSut()
    const records = await sut.load(1)
    expect(records).toEqual([{
      id: 'any_id',
      debitedUsername: 'any_debitedUsername',
      creditedUsername: 'any_creditedUsername',
      value: 'any_value',
      createdAt: 'any_createdAt'
    }])
  })
})

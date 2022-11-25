import { UserModel } from '../../../../domain/models/user'
import { LoadTransactionsByIdRepository, RecordsData } from '../../../protocols/db/transaction/load-transactions-by-id-repository'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'
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

const makeLoadTransactionsByIdRepositoryStub = (): LoadTransactionsByIdRepository => {
  class LoadTransactionsByIdRepositoryStub implements LoadTransactionsByIdRepository {
    async loadById (id: number): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadTransactionsByIdRepositoryStub()
}

type SubTypes = {
  sut: DbLoadTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadTransactionsByIdRepositoryStub: LoadTransactionsByIdRepository
}

const makeSut = (): SubTypes => {
  const loadTransactionsByIdRepositoryStub = makeLoadTransactionsByIdRepositoryStub()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadTransactions(loadUserByIdRepositoryStub, loadTransactionsByIdRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadTransactionsByIdRepositoryStub
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

  test('Should call LoadTransactionsByIdRepository with correct value', async () => {
    const { sut, loadTransactionsByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadTransactionsByIdRepositoryStub, 'loadById')
    await sut.load(1)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadTransactionsByIdRepository throws', async () => {
    const { sut, loadTransactionsByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTransactionsByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load(1)
    await expect(user).rejects.toThrow()
  })
})

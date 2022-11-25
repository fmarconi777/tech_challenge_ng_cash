import { UserModel } from '../../../../domain/models/user'
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

type SubTypes = {
  sut: DbLoadTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
}

const makeSut = (): SubTypes => {
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadTransactions(loadUserByIdRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub
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
})

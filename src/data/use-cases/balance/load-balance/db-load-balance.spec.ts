import { LoadAccountByIdRepository, LoadUserByIdRepository } from './db-load-balance-protocols'
import { DbLoadBalance } from './db-load-balance'
import { AccountModel } from '@/domain/models/account'
import { UserModel } from '@/domain/models/user'

const userId = 1

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

const makeLoadUserByIdRepositoryStub = (): LoadUserByIdRepository => {
  class LoadUserByIdRepositoryStub implements LoadUserByIdRepository {
    async loadById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByIdRepositoryStub()
}

const makeLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: number): Promise<AccountModel | null> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadBalance
  loadUserByIdRepositoryStub: LoadUserByIdRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadBalance(loadUserByIdRepositoryStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadBalance', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const LoadByUsernameSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.load(userId)
    expect(LoadByUsernameSpy).toHaveBeenCalledWith(userId)
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const balance = sut.load(userId)
    await expect(balance).rejects.toThrow()
  })

  test('Should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.load(userId)
    expect(loadByUsernameSpy).toHaveBeenCalledWith(userId)
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const balance = sut.load(userId)
    await expect(balance).rejects.toThrow()
  })

  test('Should return a balance on success', async () => {
    const { sut } = makeSut()
    const balance = await sut.load(userId)
    expect(balance).toEqual({ balance: '100.00' })
  })
})

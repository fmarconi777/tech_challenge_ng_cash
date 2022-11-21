import { AccountModel } from '../../../domain/models/account'
import { UserModel } from '../../../domain/models/user'
import { LoadAccountByIdRepository } from '../../protocols/db/accout/load-account-by-id-repository'
import { CheckUserByIdRepository } from '../../protocols/db/user/check-user-by-id-repository'
import { DbLoadBalance } from './db-load-balance'

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

const makeCheckUserByIdRepositoryStub = (): CheckUserByIdRepository => {
  class CheckUserByIdRepositorySutb implements CheckUserByIdRepository {
    async checkById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new CheckUserByIdRepositorySutb()
}

const makeLoadAccountByIdRepositoryStub = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositorySutb implements LoadAccountByIdRepository {
    async checkById (id: number): Promise<AccountModel | null> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new LoadAccountByIdRepositorySutb()
}

type SubTypes = {
  sut: DbLoadBalance
  checkUserByIdRepositoryStub: CheckUserByIdRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SubTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepositoryStub()
  const checkUserByIdRepositoryStub = makeCheckUserByIdRepositoryStub()
  const sut = new DbLoadBalance(checkUserByIdRepositoryStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    checkUserByIdRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadBalance', () => {
  test('Should call CheckUserByIdRepository with correct value', async () => {
    const { sut, checkUserByIdRepositoryStub } = makeSut()
    const checkByUsernameSpy = jest.spyOn(checkUserByIdRepositoryStub, 'checkById')
    await sut.load(userId)
    expect(checkByUsernameSpy).toHaveBeenCalledWith(userId)
  })

  test('Should throw if CheckUserByIdRepository throws', async () => {
    const { sut, checkUserByIdRepositoryStub } = makeSut()
    jest.spyOn(checkUserByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.reject(new Error()))
    const balance = sut.load(userId)
    await expect(balance).rejects.toThrow()
  })

  test('Should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const checkByUsernameSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'checkById')
    await sut.load(userId)
    expect(checkByUsernameSpy).toHaveBeenCalledWith(userId)
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.reject(new Error()))
    const balance = sut.load(userId)
    await expect(balance).rejects.toThrow()
  })
})

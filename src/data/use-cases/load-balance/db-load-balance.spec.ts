import { UserModel } from '../../../domain/models/user'
import { CheckUserByIdRepository } from '../../protocols/db/user/check-user-by-id-repository'
import { DbLoadBalance } from './db-load-balance'

const userId = 1

const makeCheckUserByIdRepositoryStub = (): CheckUserByIdRepository => {
  class CheckUserByIdRepositorySutb implements CheckUserByIdRepository {
    async checkById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new CheckUserByIdRepositorySutb()
}

type SubTypes = {
  sut: DbLoadBalance
  checkUserByIdRepositoryStub: CheckUserByIdRepository
}

const makeSut = (): SubTypes => {
  const checkUserByIdRepositoryStub = makeCheckUserByIdRepositoryStub()
  const sut = new DbLoadBalance(checkUserByIdRepositoryStub)
  return {
    sut,
    checkUserByIdRepositoryStub
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
})

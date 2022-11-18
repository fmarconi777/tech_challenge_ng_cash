import { UserModel } from '../../../domain/models/user'
import { CheckUserByUserNameORM } from '../../protocols/check-user-by-user-name-orm'
import { UserRepository } from './user-repository'

const fakeUser = {
  id: 'any_id',
  username: 'any_user',
  password: 'any_password',
  accountId: 'any_account'
}

const makeCheckUserByUserNameORMStub = (): CheckUserByUserNameORM => {
  class CheckUserByUserNameORMStub implements CheckUserByUserNameORM {
    async checkByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new CheckUserByUserNameORMStub()
}

type SubTypes = {
  sut: UserRepository
  checkUserByUserNameORMStub: CheckUserByUserNameORM
}

const makeSut = (): SubTypes => {
  const checkUserByUserNameORMStub = makeCheckUserByUserNameORMStub()
  const sut = new UserRepository(checkUserByUserNameORMStub)
  return {
    sut,
    checkUserByUserNameORMStub
  }
}

describe('User Repository', () => {
  test('Should call ORM with correct value', async () => {
    const { sut, checkUserByUserNameORMStub } = makeSut()
    const checkByUsernameSpy = jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername')
    await sut.checkByUsername('username')
    expect(checkByUsernameSpy).toHaveBeenCalledWith('username')
  })

  test('Should throw if ORM throws', async () => {
    const { sut, checkUserByUserNameORMStub } = makeSut()
    jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.checkByUsername('username')
    await expect(user).rejects.toThrow()
  })

  test('Should return null if ORM returns null', async () => {
    const { sut, checkUserByUserNameORMStub } = makeSut()
    jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername').mockReturnValueOnce(Promise.resolve(null))
    const user = await sut.checkByUsername('username')
    expect(user).toBeNull()
  })
})

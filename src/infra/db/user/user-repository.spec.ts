import { UserModel } from '../../../domain/models/user'
import { CheckUserByUserNameORM, CheckUserByIdORM } from './user-protocols'
import { UserRepository } from '../user/user-repository'
import { AccountModel } from '../../../domain/models/account'

const fakeUser = {
  id: 'any_id',
  username: 'any_user',
  password: 'any_password',
  accountId: 'any_account'
}

const fakeAccount = {
  id: '1',
  balance: '100.00'
}

const makeCheckUserByUserNameORMStub = (): CheckUserByUserNameORM => {
  class CheckUserByUserNameORMStub implements CheckUserByUserNameORM {
    async checkByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new CheckUserByUserNameORMStub()
}

const makeCheckUserByIdORMStub = (): CheckUserByIdORM => {
  class CheckUserByIdORMStub implements CheckUserByIdORM {
    async checkById (id: number): Promise<AccountModel | null> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new CheckUserByIdORMStub()
}

type SubTypes = {
  sut: UserRepository
  checkUserByUserNameORMStub: CheckUserByUserNameORM
  checkUserByIdORMStub: CheckUserByIdORM
}

const makeSut = (): SubTypes => {
  const checkUserByIdORMStub = makeCheckUserByIdORMStub()
  const checkUserByUserNameORMStub = makeCheckUserByUserNameORMStub()
  const sut = new UserRepository(checkUserByUserNameORMStub, checkUserByIdORMStub)
  return {
    sut,
    checkUserByUserNameORMStub,
    checkUserByIdORMStub
  }
}

describe('User Repository', () => {
  describe('checkByUsername', () => {
    test('Should call CheckUserByUserNameORM with correct value', async () => {
      const { sut, checkUserByUserNameORMStub } = makeSut()
      const checkByUsernameSpy = jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername')
      await sut.checkByUsername('username')
      expect(checkByUsernameSpy).toHaveBeenCalledWith('username')
    })

    test('Should throw if CheckUserByUserNameORM throws', async () => {
      const { sut, checkUserByUserNameORMStub } = makeSut()
      jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername').mockReturnValueOnce(Promise.reject(new Error()))
      const user = sut.checkByUsername('username')
      await expect(user).rejects.toThrow()
    })

    test('Should return null if CheckUserByUserNameORM returns null', async () => {
      const { sut, checkUserByUserNameORMStub } = makeSut()
      jest.spyOn(checkUserByUserNameORMStub, 'checkByUsername').mockReturnValueOnce(Promise.resolve(null))
      const user = await sut.checkByUsername('username')
      expect(user).toBeNull()
    })

    test('Should return an user on success', async () => {
      const { sut } = makeSut()
      const user = await sut.checkByUsername('username')
      expect(user).toEqual(fakeUser)
    })
  })

  describe('checkById', () => {
    test('Should call CheckUserByIdORM with correct value', async () => {
      const { sut, checkUserByIdORMStub } = makeSut()
      const checkByUsernameSpy = jest.spyOn(checkUserByIdORMStub, 'checkById')
      await sut.checkById(1)
      expect(checkByUsernameSpy).toHaveBeenCalledWith(1)
    })

    test('Should throw if CheckUserByIdORM throws', async () => {
      const { sut, checkUserByIdORMStub } = makeSut()
      jest.spyOn(checkUserByIdORMStub, 'checkById').mockReturnValueOnce(Promise.reject(new Error()))
      const user = sut.checkById(1)
      await expect(user).rejects.toThrow()
    })
  })
})

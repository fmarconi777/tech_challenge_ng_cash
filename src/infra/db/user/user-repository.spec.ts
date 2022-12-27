import { LoadUserByUserNameORM, LoadUserByIdORM } from './user-protocols'
import { UserRepository } from '../user/user-repository'
import { UserModel } from '@/domain/models/user'

const fakeUser = {
  id: 'any_id',
  username: 'any_user',
  password: 'any_password',
  accountId: 'any_account'
}

const makeLoadUserByUserNameORMStub = (): LoadUserByUserNameORM => {
  class LoadUserByUserNameORMStub implements LoadUserByUserNameORM {
    async loadByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByUserNameORMStub()
}

const makeLoadUserByIdORMStub = (): LoadUserByIdORM => {
  class LoadUserByIdORMStub implements LoadUserByIdORM {
    async loadById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByIdORMStub()
}

type SutTypes = {
  sut: UserRepository
  loadUserByUserNameORMStub: LoadUserByUserNameORM
  loadUserByIdORMStub: LoadUserByIdORM
}

const makeSut = (): SutTypes => {
  const loadUserByIdORMStub = makeLoadUserByIdORMStub()
  const loadUserByUserNameORMStub = makeLoadUserByUserNameORMStub()
  const sut = new UserRepository(loadUserByUserNameORMStub, loadUserByIdORMStub)
  return {
    sut,
    loadUserByUserNameORMStub,
    loadUserByIdORMStub
  }
}

describe('User Repository', () => {
  describe('LoadByUsername', () => {
    test('Should call LoadUserByUserNameORM with correct value', async () => {
      const { sut, loadUserByUserNameORMStub } = makeSut()
      const loadByUsernameSpy = jest.spyOn(loadUserByUserNameORMStub, 'loadByUsername')
      await sut.loadByUsername('username')
      expect(loadByUsernameSpy).toHaveBeenCalledWith('username')
    })

    test('Should throw if LoadUserByUserNameORM throws', async () => {
      const { sut, loadUserByUserNameORMStub } = makeSut()
      jest.spyOn(loadUserByUserNameORMStub, 'loadByUsername').mockReturnValueOnce(Promise.reject(new Error()))
      const user = sut.loadByUsername('username')
      await expect(user).rejects.toThrow()
    })

    test('Should return null if LoadUserByUserNameORM returns null', async () => {
      const { sut, loadUserByUserNameORMStub } = makeSut()
      jest.spyOn(loadUserByUserNameORMStub, 'loadByUsername').mockReturnValueOnce(Promise.resolve(null))
      const user = await sut.loadByUsername('username')
      expect(user).toBeNull()
    })

    test('Should return an user on success', async () => {
      const { sut } = makeSut()
      const user = await sut.loadByUsername('username')
      expect(user).toEqual(fakeUser)
    })
  })

  describe('LoadById', () => {
    test('Should call LoadUserByIdORM with correct value', async () => {
      const { sut, loadUserByIdORMStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadUserByIdORMStub, 'loadById')
      await sut.loadById(1)
      expect(loadByIdSpy).toHaveBeenCalledWith(1)
    })

    test('Should throw if LoadUserByIdORM throws', async () => {
      const { sut, loadUserByIdORMStub } = makeSut()
      jest.spyOn(loadUserByIdORMStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
      const user = sut.loadById(1)
      await expect(user).rejects.toThrow()
    })

    test('Should return null if LoadUserByIdORM returns null', async () => {
      const { sut, loadUserByIdORMStub } = makeSut()
      jest.spyOn(loadUserByIdORMStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
      const user = await sut.loadById(1)
      expect(user).toBeNull()
    })

    test('Should return an user on success', async () => {
      const { sut } = makeSut()
      const user = await sut.loadById(1)
      expect(user).toEqual(fakeUser)
    })
  })
})

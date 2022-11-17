import { UserModel } from '../../../domain/models/user'
import { Hasher, UserData, AddUserAccountRepository, CheckUserByUsernameRepository } from './db-add-user-account-protocols'
import { DbAddUserAccount } from './db-add-user-accout'

const userData = {
  username: 'valid_username',
  password: 'valid_password'
}

const fakeUser = {
  id: 'any_id',
  username: 'any_username',
  password: 'any_password',
  accountId: 'any_accountId'
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (password: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const makeAddUserAccountRepositoryStub = (): AddUserAccountRepository => {
  class AddUserAccountRepositoryStub implements AddUserAccountRepository {
    async addUserAccount (userData: UserData): Promise<string> {
      return await Promise.resolve('Account succesfully created')
    }
  }
  return new AddUserAccountRepositoryStub()
}

const makeCheckUserByUsernameRepositoryStub = (): CheckUserByUsernameRepository => {
  class CheckUserByUsernameRepositoryStub implements CheckUserByUsernameRepository {
    async checkByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new CheckUserByUsernameRepositoryStub()
}

type SubTypes = {
  sut: DbAddUserAccount
  hasherStub: Hasher
  addUserAccountRepositoryStub: AddUserAccountRepository
  checkUserByUsernameRepositoryStub: CheckUserByUsernameRepository
}

const makeSut = (): SubTypes => {
  const checkUserByUsernameRepositoryStub = makeCheckUserByUsernameRepositoryStub()
  const addUserAccountRepositoryStub = makeAddUserAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddUserAccount(hasherStub, addUserAccountRepositoryStub, checkUserByUsernameRepositoryStub)
  return {
    sut,
    hasherStub,
    addUserAccountRepositoryStub,
    checkUserByUsernameRepositoryStub
  }
}

describe('DbAddUserAccount', () => {
  test('Should call CheckUserByUsernameRepository with correct value', async () => {
    const { sut, checkUserByUsernameRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(checkUserByUsernameRepositoryStub, 'checkByUsername')
    await sut.addUserAccount(userData)
    expect(addSpy).toHaveBeenCalledWith('valid_username')
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.addUserAccount(userData)
    expect(hashSpy).toHaveBeenCalledWith(userData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const userAccount = sut.addUserAccount(userData)
    await expect(userAccount).rejects.toThrow()
  })

  test('Should call AddUserAccountRepository with correct values', async () => {
    const { sut, addUserAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addUserAccountRepositoryStub, 'addUserAccount')
    await sut.addUserAccount(userData)
    expect(addSpy).toHaveBeenCalledWith({
      username: 'valid_username',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddUserAccountRepository throws', async () => {
    const { sut, addUserAccountRepositoryStub } = makeSut()
    jest.spyOn(addUserAccountRepositoryStub, 'addUserAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const userAccount = sut.addUserAccount(userData)
    await expect(userAccount).rejects.toThrow()
  })

  test('Should return the a message on success', async () => {
    const { sut } = makeSut()
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toBe('Account succesfully created')
  })
})

import { Hasher, UserData, AddUserAccountRepository } from './db-add-user-account-protocols'
import { DbAddUserAccount } from './db-add-user-accout'

const userData = {
  username: 'valid_username',
  password: 'valid_password'
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

type SubTypes = {
  sut: DbAddUserAccount
  hasherStub: Hasher
  addUserAccountRepositoryStub: AddUserAccountRepository
}

const makeSut = (): SubTypes => {
  const addUserAccountRepositoryStub = makeAddUserAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddUserAccount(hasherStub, addUserAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addUserAccountRepositoryStub
  }
}

describe('DbAddUserAccount', () => {
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
})

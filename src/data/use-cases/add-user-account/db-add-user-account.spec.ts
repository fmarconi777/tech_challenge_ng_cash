import { UserModel } from '../../../domain/models/user'
import { Hasher, UserData, AddUserAccountRepository, LoadUserByUsernameRepository } from './db-add-user-account-protocols'
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

const makeLoadUserByUsernameRepositoryStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
    async loadByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadUserByUsernameRepositoryStub()
}

type SubTypes = {
  sut: DbAddUserAccount
  hasherStub: Hasher
  addUserAccountRepositoryStub: AddUserAccountRepository
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
}

const makeSut = (): SubTypes => {
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const addUserAccountRepositoryStub = makeAddUserAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddUserAccount(hasherStub, addUserAccountRepositoryStub, loadUserByUsernameRepositoryStub)
  return {
    sut,
    hasherStub,
    addUserAccountRepositoryStub,
    loadUserByUsernameRepositoryStub
  }
}

describe('DbAddUserAccount', () => {
  test('Should call LoadUserByUsernameRepository with correct value', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername')
    await sut.addUserAccount(userData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith('valid_username')
  })

  test('Should throw if LoadUserByUsernameRepository throws', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername').mockReturnValueOnce(Promise.reject(new Error()))
    const userAccount = sut.addUserAccount(userData)
    await expect(userAccount).rejects.toThrow()
  })

  test('Should return null if LoadUserByUsernameRepository returns an user', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername').mockReturnValueOnce(Promise.resolve(fakeUser))
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toBeNull()
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
    const addUserAccountSpy = jest.spyOn(addUserAccountRepositoryStub, 'addUserAccount')
    await sut.addUserAccount(userData)
    expect(addUserAccountSpy).toHaveBeenCalledWith({
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

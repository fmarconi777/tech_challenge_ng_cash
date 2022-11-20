import { UserModel } from '../../../domain/models/user'
import { HashComparer, Encrypter, CheckUserByUsernameRepository } from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'

const fakeAuthenticationParams = {
  username: 'fake_user',
  password: 'fake_password'
}

const fakeUser = {
  id: 'fake_id',
  username: 'fake_username',
  password: 'fake_password',
  accountId: 'fake_accountId'
}

const makeCheckUserByUsernameRepositoryStub = (): CheckUserByUsernameRepository => {
  class CheckUserByUsernameRepositoryStub implements CheckUserByUsernameRepository {
    async checkByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new CheckUserByUsernameRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve('access_token')
    }
  }
  return new EncrypterStub()
}

type SubTypes = {
  sut: DbAuthentication
  checkUserByUsernameRepositoryStub: CheckUserByUsernameRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
}

const makeSut = (): SubTypes => {
  const encrypterStub = makeEncrypterStub()
  const hashComparerStub = makeHashComparerStub()
  const checkUserByUsernameRepositoryStub = makeCheckUserByUsernameRepositoryStub()
  const sut = new DbAuthentication(checkUserByUsernameRepositoryStub, hashComparerStub, encrypterStub)
  return {
    sut,
    checkUserByUsernameRepositoryStub,
    hashComparerStub,
    encrypterStub
  }
}

describe('DbAuthentication', () => {
  test('Should call CheckUserByUsernameRepository with correct username', async () => {
    const { sut, checkUserByUsernameRepositoryStub } = makeSut()
    const checkByUsernameSpy = jest.spyOn(checkUserByUsernameRepositoryStub, 'checkByUsername')
    await sut.auth(fakeAuthenticationParams)
    expect(checkByUsernameSpy).toHaveBeenLastCalledWith(fakeAuthenticationParams.username)
  })

  test('Should throw if CheckUserByUsernameRepository throws', async () => {
    const { sut, checkUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(checkUserByUsernameRepositoryStub, 'checkByUsername').mockReturnValueOnce(Promise.reject(new Error()))
    const accessToken = sut.auth(fakeAuthenticationParams)
    await expect(accessToken).rejects.toThrow()
  })

  test('Should return null if CheckUserByUsernameRepository returns null', async () => {
    const { sut, checkUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(checkUserByUsernameRepositoryStub, 'checkByUsername').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(fakeAuthenticationParams)
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(fakeAuthenticationParams)
    expect(compareSpy).toHaveBeenLastCalledWith(fakeAuthenticationParams.password, 'fake_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const accessToken = sut.auth(fakeAuthenticationParams)
    await expect(accessToken).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(fakeAuthenticationParams)
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(fakeAuthenticationParams)
    expect(encryptSpy).toHaveBeenLastCalledWith('fake_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const accessToken = sut.auth(fakeAuthenticationParams)
    await expect(accessToken).rejects.toThrow()
  })

  test('Should return an access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(fakeAuthenticationParams)
    expect(accessToken).toBe('access_token')
  })
})

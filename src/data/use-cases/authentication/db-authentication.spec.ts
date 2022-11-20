import { UserModel } from '../../../domain/models/user'
import { HashComparer } from '../../protocols/crytography/hash-comparer'
import { TokenGenerator } from '../../protocols/crytography/token-generator'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'
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

const makeLoadUserByUsernameRepositoryStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
    async load (username: string): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByUsernameRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await Promise.resolve('access_token')
    }
  }
  return new TokenGeneratorStub()
}

type SubTypes = {
  sut: DbAuthentication
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SubTypes => {
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const hashComparerStub = makeHashComparerStub()
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const sut = new DbAuthentication(loadUserByUsernameRepositoryStub, hashComparerStub, tokenGeneratorStub)
  return {
    sut,
    loadUserByUsernameRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('DbAuthentication', () => {
  test('Should call LoadUserByUsernameRepository with correct username', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'load')
    await sut.auth(fakeAuthenticationParams)
    expect(loadSpy).toHaveBeenLastCalledWith(fakeAuthenticationParams.username)
  })

  test('Should throw if LoadUserByUsernameRepository throws', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const accessToken = sut.auth(fakeAuthenticationParams)
    await expect(accessToken).rejects.toThrow()
  })

  test('Should return null if LoadUserByUsernameRepository returns null', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    jest.spyOn(loadUserByUsernameRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null))
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

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(fakeAuthenticationParams)
    expect(generateSpy).toHaveBeenLastCalledWith('fake_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const accessToken = sut.auth(fakeAuthenticationParams)
    await expect(accessToken).rejects.toThrow()
  })
})

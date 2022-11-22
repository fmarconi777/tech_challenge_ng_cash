import { UserModel } from '../../../domain/models/user'
import { Decrypter } from '../../protocols/crytography/decrypter'
import { LoadUserByIdRepository } from '../../protocols/db/user/load-user-by-id-repository'
import { DbLoadUserByToken } from './db-load-user-by-token'

const fakeUser = {
  id: '1',
  username: 'any_username',
  password: 'any_password',
  accountId: '1'
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<any | null> {
      return await Promise.resolve({ id: 'any_id' })
    }
  }
  return new DecrypterStub()
}

const makeLoadUserByIdRepositoryStub = (): LoadUserByIdRepository => {
  class LoadUserByIdRepositoryStub implements LoadUserByIdRepository {
    async loadById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByIdRepositoryStub()
}

type SubTypes = {
  sut: DbLoadUserByToken
  decrypterStub: Decrypter
  loadUserByIdRepositoryStub: LoadUserByIdRepository
}

const makeSut = (): SubTypes => {
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadUserByToken(decrypterStub, loadUserByIdRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadUserByIdRepositoryStub
  }
}

describe('DbLoadUserByToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load('any_token')
    await expect(user).rejects.toThrow()
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(''))
    const user = await sut.load('any_token')
    expect(user).toBeNull()
  })

  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const decryptSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if LoadUserByIdRepository throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    jest.spyOn(loadUserByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load('any_token')
    await expect(user).rejects.toThrow()
  })
})

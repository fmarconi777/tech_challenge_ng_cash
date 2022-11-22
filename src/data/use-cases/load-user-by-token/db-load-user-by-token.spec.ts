import { Decrypter } from '../../protocols/crytography/decrypter'
import { DbLoadUserByToken } from './db-load-user-by-token'

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

type SubTypes = {
  sut: DbLoadUserByToken
  decrypterStub: Decrypter
}

const makeSut = (): SubTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadUserByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadUserByToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.load('any_token', 'any_role')
    await expect(user).rejects.toThrow()
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(''))
    const user = await sut.load('any_token', 'any_role')
    expect(user).toBeNull()
  })
})

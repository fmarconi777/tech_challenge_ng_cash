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
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})

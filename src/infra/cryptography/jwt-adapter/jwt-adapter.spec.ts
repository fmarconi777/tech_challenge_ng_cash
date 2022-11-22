import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'
import { JwtAdapter } from './jwt-adapter'

const secretKey = process.env.SECRET_KEY

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },

  verify (): JwtPayload {
    return { id: 'any_id' }
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter()
  return sut
}

describe('JWTAdapter', () => {
  describe('sign', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secretKey, { expiresIn: '1d' })
    })

    test('should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() }) // eslint-disable-line
      const token = sut.encrypt('any_id')
      await expect(token).rejects.toThrow()
    })

    test('should return a token on sign success', async () => {
      const sut = makeSut()
      const token = await sut.encrypt('any_id')
      expect(token).toBe('any_token')
    })
  })

  describe('verify', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', secretKey)
    })

    test('should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() }) // eslint-disable-line
      const payload = sut.decrypt('any_token')
      await expect(payload).rejects.toThrow()
    })

    test('should return an payload on verify success', async () => {
      const sut = makeSut()
      const payload = await sut.decrypt('any_token')
      expect(payload).toEqual({ id: 'any_id' })
    })
  })
})

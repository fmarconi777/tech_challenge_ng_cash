import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { JwtAdapter } from './jwt-adapter'

const secretKey = process.env.SECRET_KEY

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter()
  return sut
}

describe('JWTAdapter', () => {
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
})
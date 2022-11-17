import bcrypt from 'bcrypt'
import 'dotenv/config'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashedPassword')
  }
}))

const salt = process.env.SALT

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password', +(salt as string))
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = new BcryptAdapter()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error())) // eslint-disable-line
    const hashedPassword = sut.hash('any_password')
    await expect(hashedPassword).rejects.toThrow()
  })

  test('Should return a hash on success', async () => {
    const sut = new BcryptAdapter()
    const hashedPassword = await sut.hash('any_password')
    expect(hashedPassword).toBe('hashedPassword')
  })
})

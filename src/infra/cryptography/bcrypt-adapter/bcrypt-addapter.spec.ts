import bcrypt from 'bcrypt'
import 'dotenv/config'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashedPassword')
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const salt = process.env.SALT

describe('Bcrypt Adapter', () => {
  describe('hash', () => {
    test('Should call hash with correct value', async () => {
      const sut = new BcryptAdapter()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_password')
      expect(hashSpy).toHaveBeenCalledWith('any_password', +(salt as string))
    })

    test('Should throw if hash throws', async () => {
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

  describe('compare', () => {
    test('Should call compare with correct values', async () => {
      const sut = new BcryptAdapter()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_value')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_value')
    })

    test('Should throw if compare throws', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error())) // eslint-disable-line
      const hashedPassword = sut.compare('any_value', 'any_value')
      await expect(hashedPassword).rejects.toThrow()
    })

    test('Should return false when compare succeds', async () => {
      const sut = new BcryptAdapter()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false)) // eslint-disable-line
      const hashedPassword = await sut.compare('any_value', 'any_value')
      expect(hashedPassword).toBeFalsy()
    })

    test('Should return true when compare succeds', async () => {
      const sut = new BcryptAdapter()
      const hashedPassword = await sut.compare('any_value', 'any_value')
      expect(hashedPassword).toBeTruthy()
    })
  })
})

import bcrypt from 'bcrypt'
import 'dotenv/config'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = process.env.SALT

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password', +(salt as string))
  })
})

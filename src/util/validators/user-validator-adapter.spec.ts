import { UserValidatorAdapter } from './user-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isAlphanumeric (): boolean {
    return true
  }
}))

describe('UserValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new UserValidatorAdapter()
    jest.spyOn(validator, 'isAlphanumeric').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_username')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = new UserValidatorAdapter()
    const isValid = sut.isValid('valid_username')
    expect(isValid).toBeTruthy()
  })
})

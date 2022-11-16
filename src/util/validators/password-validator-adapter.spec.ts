import { PasswordValidatorAdapter } from './password-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isStrongPassword (): boolean {
    return true
  }
}))

describe('PasswordValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new PasswordValidatorAdapter()
    jest.spyOn(validator, 'isStrongPassword').mockReturnValueOnce(0)
    const isValid = sut.isValid('any_password')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = new PasswordValidatorAdapter()
    const isValid = sut.isValid('any_password')
    expect(isValid).toBeTruthy()
  })
})

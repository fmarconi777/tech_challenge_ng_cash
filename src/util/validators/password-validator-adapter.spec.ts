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
    const isValid = sut.isValid('invalid_password')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = new PasswordValidatorAdapter()
    const isValid = sut.isValid('valid_password')
    expect(isValid).toBeTruthy()
  })

  test('Should call validator with correct password', () => {
    const sut = new PasswordValidatorAdapter()
    const isStrongPasswordSpy = jest.spyOn(validator, 'isStrongPassword')
    sut.isValid('any_password')
    expect(isStrongPasswordSpy).toHaveBeenCalledWith('any_password', { minSymbols: 0 })
  })
})

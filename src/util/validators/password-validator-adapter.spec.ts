import { PasswordValidatorAdapter } from './password-validator-adapter'

describe('PasswordValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new PasswordValidatorAdapter()
    const isValid = sut.isValid('any_password')
    expect(isValid).toBeFalsy()
  })
})

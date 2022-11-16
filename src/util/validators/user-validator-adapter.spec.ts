import { UserValidatorAdapter } from './user-validator-adapter'

describe('UserValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new UserValidatorAdapter()
    const isValid = sut.isValid('invalid_username')
    expect(isValid).toBeFalsy()
  })
})

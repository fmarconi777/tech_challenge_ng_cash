import { DateValidatorAdapter } from './date-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isDate (): boolean {
    return true
  }
}))

describe('DateValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new DateValidatorAdapter()
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBeFalsy()
  })
})

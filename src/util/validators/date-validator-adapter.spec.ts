import { DateValidatorAdapter } from './date-validator-adapter'
import validator from 'validator'

describe('DateValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new DateValidatorAdapter()
    jest.spyOn(validator, 'isDate').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = new DateValidatorAdapter()
    const isValid = sut.isValid('2022-10-12')
    expect(isValid).toBeTruthy()
  })

  test('Should call validator with correct values', () => {
    const sut = new DateValidatorAdapter()
    const isDateSpy = jest.spyOn(validator, 'isDate')
    sut.isValid('2022-10-12')
    expect(isDateSpy).toHaveBeenCalledWith('2022-10-12', { format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] })
  })
})

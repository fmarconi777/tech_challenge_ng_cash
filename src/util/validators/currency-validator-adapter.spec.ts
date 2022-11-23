import { CurrencyValidatorAdapter } from './currency-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isCurrency (): boolean {
    return true
  }
}))

describe('CurrencyValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new CurrencyValidatorAdapter()
    jest.spyOn(validator, 'isCurrency').mockReturnValueOnce(false)
    const isValid = sut.isValid('1.000.00')
    expect(isValid).toBeFalsy()
  })

  test('Should return true if validator returns true', () => {
    const sut = new CurrencyValidatorAdapter()
    const isValid = sut.isValid('100.00')
    expect(isValid).toBeTruthy()
  })

  test('Should call validator with correct values', () => {
    const sut = new CurrencyValidatorAdapter()
    const isAlphanumericSpy = jest.spyOn(validator, 'isCurrency')
    sut.isValid('100.00')
    expect(isAlphanumericSpy).toHaveBeenCalledWith('100.00', { allow_negatives: false, thousands_separator: '', require_decimal: true })
  })
})

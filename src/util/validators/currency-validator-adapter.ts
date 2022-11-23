import { Validator } from '../../presentation/protocols'

export class CurrencyValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return false
  }
}

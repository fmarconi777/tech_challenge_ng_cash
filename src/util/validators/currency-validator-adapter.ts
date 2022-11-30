import { Validator } from '@/presentation/protocols'
import validator from 'validator'

export class CurrencyValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return validator.isCurrency(param, { allow_negatives: false, thousands_separator: '', require_decimal: true })
  }
}

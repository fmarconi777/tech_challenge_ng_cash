import { Validator } from '@/presentation/protocols'
import validator from 'validator'

export class DateValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return validator.isDate(param, { format: 'YYYY-MM-DD', strictMode: true, delimiters: ['-'] })
  }
}

import { Validator } from '../../presentation/protocols'

export class DateValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return false
  }
}

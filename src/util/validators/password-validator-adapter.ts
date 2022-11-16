import { Validator } from '../../presentation/protocols'

export class PasswordValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return false
  }
}

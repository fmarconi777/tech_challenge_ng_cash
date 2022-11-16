import { Validator } from '../../presentation/protocols'
import validator from 'validator'

export class PasswordValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return validator.isStrongPassword(param, { minSymbols: 0 })
  }
}

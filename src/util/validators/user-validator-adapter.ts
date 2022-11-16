import { Validator } from '../../presentation/protocols'
import validator from 'validator'

export class UserValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    if (validator.isAlphanumeric(param, 'pt-BR') && param.length >= 3) {
      return true
    }
    return false
  }
}

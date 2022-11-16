import { Validator } from '../../presentation/protocols'

export class UserValidatorAdapter implements Validator {
  isValid (param: string): boolean {
    return false
  }
}

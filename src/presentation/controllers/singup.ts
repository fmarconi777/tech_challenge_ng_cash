import { Controller, HttpRequest, HttpResponse, Validator } from '../protocols'
import { InvalidParamError, MissingParamError } from './errors'
import { badRequest, serverError } from './helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly userValidator: Validator,
    private readonly passwordValidator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username, password } = httpRequest.body
      if (!this.userValidator.isValid(username)) {
        return badRequest(new InvalidParamError('username'))
      }
      if (!this.passwordValidator.isValid(password)) {
        return badRequest(new InvalidParamError('password'))
      }
      return {
        status: 200,
        body: ''
      }
    } catch (error: any) {
      return serverError()
    }
  }
}

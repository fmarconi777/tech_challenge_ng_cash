import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Validator } from '../protocols/validator'
import { InvalidParamError } from './errors/invalid-param-error'
import { MissingParamError } from './errors/missing-param-error'
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
      if (!this.userValidator.isValid(httpRequest.body.username)) {
        return badRequest(new InvalidParamError('username'))
      }
      if (!this.passwordValidator.isValid(httpRequest.body.password)) {
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

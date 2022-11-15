import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Validator } from '../protocols/validator'
import { MissingParamError } from './errors/missing-param-error'
import { badRequest } from './helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly userValidator: Validator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    this.userValidator.isValid(httpRequest.body.username)
    return {
      status: 200,
      body: ''
    }
  }
}

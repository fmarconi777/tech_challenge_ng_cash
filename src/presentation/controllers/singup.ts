import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from './errors/missing-param-error'
import { badRequest } from './helpers/http-helper'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.username) {
      return badRequest(new MissingParamError('username'))
    }
    return {
      status: 200,
      body: ''
    }
  }
}

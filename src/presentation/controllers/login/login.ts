import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['username', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return {
      status: 200,
      body: ''
    }
  }
}

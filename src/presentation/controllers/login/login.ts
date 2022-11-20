import { Controller, HttpRequest, HttpResponse, Authentication } from './singup-protocols'
import { MissingParamError } from '../errors'
import { badRequest, okResponse, serverError, unauthorized } from '../helpers/http-helper'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ username, password })
      if (!accessToken) {
        return unauthorized()
      }
      return okResponse(accessToken)
    } catch (error: any) {
      return serverError()
    }
  }
}

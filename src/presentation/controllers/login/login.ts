import { Controller, HttpRequest, HttpResponse, Authentication } from './login-protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, methodNotAllowed, ok, serverError, unauthorized } from '@/presentation/helpers/http-helper'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    switch (method) {
      case 'POST':
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
          return ok(accessToken)
        } catch (error: any) {
          return serverError()
        }
      default:
        return methodNotAllowed()
    }
  }
}

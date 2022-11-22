import { AccessDeniedError } from '../errors'
import { forbidden, okResponse, serverError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Middleware, LoadUserByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.header
      if (accessToken && accessToken !== 'undefined') {
        const user = await this.loadUserByToken.load(httpRequest.header, this.role)
        if (user) {
          return okResponse({ userId: user.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error: any) {
      return serverError()
    }
  }
}

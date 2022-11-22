import { LoadUserByToken } from '../../domain/use-cases/load-user-by-token/load-user-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, okResponse } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.header
    if (accessToken && accessToken !== 'undefined') {
      const user = await this.loadUserByToken.load(httpRequest.header, this.role)
      if (user) {
        return okResponse('')
      }
    }
    return forbidden(new AccessDeniedError())
  }
}

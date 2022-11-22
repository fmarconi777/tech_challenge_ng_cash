import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.header
    if (accessToken && accessToken !== 'undefined') {
      await this.loadAccountByToken.load(httpRequest.header, this.role)
    }
    return forbidden(new AccessDeniedError())
  }
}

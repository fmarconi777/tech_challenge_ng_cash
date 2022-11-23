import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, okResponse } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class TransactionController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { username } = httpRequest.user
    const { cashInUsername } = httpRequest.body
    if (!cashInUsername) {
      return badRequest(new MissingParamError('cashInUsername'))
    }
    if (username === cashInUsername) {
      return badRequest(new InvalidParamError('cashInUsername'))
    }
    return okResponse('')
  }
}

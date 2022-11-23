import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, okResponse } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class TransactionController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['cashInUsername', 'credit']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { username } = httpRequest.user
    const { cashInUsername } = httpRequest.body
    if (username === cashInUsername) {
      return badRequest(new InvalidParamError('cashInUsername'))
    }
    return okResponse('')
  }
}

import { MissingParamError } from '../../errors'
import { badRequest, okResponse } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class TransactionController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { username } = httpRequest.body
    if (!username) {
      return badRequest(new MissingParamError('username'))
    }
    return okResponse('')
  }
}

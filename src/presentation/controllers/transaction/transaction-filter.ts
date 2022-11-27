import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from './transaction-protocols'

export class TransactionFilterController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    const param = httpRequest.param
    switch (method) {
      case 'GET':
        switch (param) {
          default:
            return badRequest(new InvalidParamError('expected date, cashIn or cashOut params'))
        }
      default:
        return methodNotAllowed()
    }
  }
}

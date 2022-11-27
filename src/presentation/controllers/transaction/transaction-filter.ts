import { methodNotAllowed } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from './transaction-protocols'

export class TransactionFilterController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    switch (method) {
      case 'GET':
      default:
        return methodNotAllowed()
    }
  }
}

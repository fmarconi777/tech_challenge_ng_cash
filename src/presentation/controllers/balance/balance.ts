import { LoadBalance, Controller, HttpRequest, HttpResponse } from './balance-protocols'
import { methodNotAllowed, ok, serverError } from '../../helpers/http-helper'

export class BalanceController implements Controller {
  constructor (private readonly loadBalance: LoadBalance) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    switch (method) {
      case 'GET':
        try {
          const id = +httpRequest.user.id
          return ok(await this.loadBalance.load(id))
        } catch (error: any) {
          return serverError()
        }
      default:
        return methodNotAllowed()
    }
  }
}

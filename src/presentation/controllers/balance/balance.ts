import { LoadBalance, Controller, HttpRequest, HttpResponse } from './balance-protocols'
import { okResponse, serverError } from '../../helpers/http-helper'

export class BalanceController implements Controller {
  constructor (private readonly loadBalance: LoadBalance) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return okResponse(await this.loadBalance.load(+httpRequest.userId))
    } catch (error: any) {
      return serverError()
    }
  }
}

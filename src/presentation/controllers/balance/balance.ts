import { LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { okResponse, serverError } from '../helpers/http-helper'

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

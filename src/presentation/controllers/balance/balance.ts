import { LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { serverError } from '../helpers/http-helper'

export class BalanceController implements Controller {
  constructor (private readonly loadBalance: LoadBalance) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadBalance.load(+httpRequest.userId)
      return {
        status: 200,
        body: ''
      }
    } catch (error: any) {
      return serverError()
    }
  }
}

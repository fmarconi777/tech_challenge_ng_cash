import { LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class BalanceController implements Controller {
  constructor (private readonly loadBalance: LoadBalance) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadBalance.load(+httpRequest.userId)
    return {
      status: 200,
      body: ''
    }
  }
}

import { LoadFilteredCashTransactions, Controller } from './transaction-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'

export class TransactionFilterController implements Controller {
  constructor (
    private readonly loadFilteredCashTransactions: LoadFilteredCashTransactions
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    const param = httpRequest.param
    const { id } = httpRequest.user
    switch (method) {
      case 'GET':
        try {
          switch (param) {
            case 'cashIn':
              return ok(await this.loadFilteredCashTransactions.load({ userId: +id, filter: 'creditedAccountId' })
              )
            case 'cashOut':
              return ok(await this.loadFilteredCashTransactions.load({ userId: +id, filter: 'debitedAccountId' })
              )
            default:
              return badRequest(new InvalidParamError('expected cashIn or cashOut params on route'))
          }
        } catch (error: any) {
          return serverError()
        }
      case 'POST':
        if (param !== 'date') {
          return badRequest(new InvalidParamError('expected "date" param on route'))
        }
        return ok('')
      default:
        return methodNotAllowed()
    }
  }
}

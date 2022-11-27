import { LoadFilteredCashTransactions, Controller } from './transaction-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed, okResponse, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'

export class TransactionFilterController implements Controller {
  constructor (
    private readonly loadFilteredCashTransactionsStub: LoadFilteredCashTransactions
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
              return okResponse(await this.loadFilteredCashTransactionsStub.load({ userId: +id, filter: param })
              )
            case 'cashOut':
              return okResponse(await this.loadFilteredCashTransactionsStub.load({ userId: +id, filter: param })
              )
            default:
              return badRequest(new InvalidParamError('expected cashIn or cashOut params'))
          }
        } catch (error: any) {
          return serverError()
        }
      default:
        return methodNotAllowed()
    }
  }
}

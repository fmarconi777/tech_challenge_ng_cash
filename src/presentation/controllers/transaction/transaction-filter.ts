import { LoadFilteredCashTransactions } from '../../../domain/use-cases/transaction/load-filtered-cash-transactions/load-filtered-cash-transactions'
import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed, okResponse, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from './transaction-protocols'

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
              await this.loadFilteredCashTransactionsStub.load({ userId: +id, filter: param })
              return okResponse('')
            case 'cashOut':
              await this.loadFilteredCashTransactionsStub.load({ userId: +id, filter: param })
              return okResponse('')
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

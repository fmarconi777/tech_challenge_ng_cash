import { LoadFilteredCashTransactions, Controller } from './transaction-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, methodNotAllowed, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, Validator } from '../../protocols'

export class TransactionFilterController implements Controller {
  constructor (
    private readonly loadFilteredCashTransactions: LoadFilteredCashTransactions,
    private readonly dateValidator: Validator
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
        try {
          if (param !== 'date') {
            return badRequest(new InvalidParamError('expected "date" param on route'))
          }
          const requiredFields = ['startDate', 'endDate']
          for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
              return badRequest(new MissingParamError(field))
            }
          }
          this.dateValidator.isValid(httpRequest.body.startDate)
        } catch (error: any) {
          return serverError()
        }
        return ok('')
      default:
        return methodNotAllowed()
    }
  }
}

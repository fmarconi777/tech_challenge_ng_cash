import { LoadFilterByCashTransactions, Controller, LoadFilterByDateTransactions } from './transaction-protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, methodNotAllowed, ok, serverError } from '@/presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, Validator } from '@/presentation/protocols'

export class TransactionFilterController implements Controller {
  constructor (
    private readonly loadFilterByCashTransactions: LoadFilterByCashTransactions,
    private readonly dateValidator: Validator,
    private readonly loadFilterByDateTransactions: LoadFilterByDateTransactions
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
              return ok(await this.loadFilterByCashTransactions.loadByCash({ userId: +id, filter: 'creditedAccountId' })
              )
            case 'cashOut':
              return ok(await this.loadFilterByCashTransactions.loadByCash({ userId: +id, filter: 'debitedAccountId' })
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
          for (const field of requiredFields) {
            if (!this.dateValidator.isValid(httpRequest.body[field])) {
              return badRequest(new InvalidParamError(field))
            }
          }
          const { startDate, endDate } = httpRequest.body
          return ok(await this.loadFilterByDateTransactions.loadByDate({ userId: +id, startDate, endDate }))
        } catch (error: any) {
          return serverError()
        }
      default:
        return methodNotAllowed()
    }
  }
}

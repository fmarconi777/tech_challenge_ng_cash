import { RecordTransaction } from '../../../domain/use-cases/transaction/record-transaction'
import { InvalidParamError, MissingParamError } from '../../errors'
import { TransactionError } from '../../errors/transaction-error'
import { badRequest, okResponse, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validator } from '../../protocols'

export class TransactionController implements Controller {
  constructor (
    private readonly currencyValidator: Validator,
    private readonly recordTransaction: RecordTransaction
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['cashInUsername', 'credit']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username } = httpRequest.user
      const { cashInUsername, credit } = httpRequest.body
      if (username === cashInUsername) {
        return badRequest(new InvalidParamError('cashInUsername'))
      }
      if (!this.currencyValidator.isValid(credit)) {
        return badRequest(new InvalidParamError('credit'))
      }
      const transactionData = {
        cashOutUsername: username,
        cashInUsername,
        credit
      }
      const record = await this.recordTransaction.record(transactionData)
      if (!record.recorded) {
        return badRequest(new TransactionError(record.message))
      }
      return okResponse('')
    } catch (error: any) {
      return serverError()
    }
  }
}

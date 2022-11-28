import { LoadTransactions, RecordTransaction, Controller, HttpRequest, HttpResponse, Validator } from './transaction-protocols'
import { InvalidParamError, MissingParamError, TransactionError } from '../../errors'
import { badRequest, created, methodNotAllowed, ok, serverError } from '../../helpers/http-helper'

export class TransactionController implements Controller {
  constructor (
    private readonly currencyValidator: Validator,
    private readonly recordTransaction: RecordTransaction,
    private readonly loadTransactions: LoadTransactions
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    const { id, username } = httpRequest.user
    switch (method) {
      case 'POST':
        try {
          const requiredFields = ['creditedUsername', 'value']
          for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
              return badRequest(new MissingParamError(field))
            }
          }
          const { creditedUsername, value } = httpRequest.body
          if (username === creditedUsername) {
            return badRequest(new InvalidParamError('creditedUsername'))
          }
          if (!this.currencyValidator.isValid(value)) {
            return badRequest(new InvalidParamError('value'))
          }
          const transactionData = {
            debitedUsername: username,
            creditedUsername,
            value
          }
          const record = await this.recordTransaction.record(transactionData)
          if (!record.recorded) {
            return badRequest(new TransactionError(record.message))
          }
          return created(record.message)
        } catch (error: any) {
          return serverError()
        }
      case 'GET':
        try {
          return ok(await this.loadTransactions.load(+id))
        } catch (error: any) {
          return serverError()
        }
      default:
        return methodNotAllowed()
    }
  }
}

import { Record, RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { InvalidParamError, MissingParamError } from '../../errors'
import { TransactionError } from '../../errors/transaction-error'
import { badRequest, methodNotAllowed, okResponse, serverError } from '../../helpers/http-helper'
import { Validator } from '../../protocols'
import { TransactionController } from './transaction'

const request = {
  body: {
    creditedUsername: 'some_username',
    value: '100.00'
  },
  user: {
    id: '1',
    username: 'any_username'
  },
  method: 'POST'
}

const makeRecordTransactionStub = (): RecordTransaction => {
  class RecordTransactionStub implements RecordTransaction {
    async record (transactionData: TransactionData): Promise<Record> {
      return {
        recorded: true,
        message: 'Transaction succesfully recorded'
      }
    }
  }
  return new RecordTransactionStub()
}

const makesCurrencyValidatorStub = (): Validator => {
  class CurrencyValidatorStub implements Validator {
    isValid (param: string): boolean {
      return true
    }
  }
  return new CurrencyValidatorStub()
}

type Subtypes = {
  sut: TransactionController
  recordTransactionStub: RecordTransaction
  currencyValidatorStub: Validator
}

const makeSut = (): Subtypes => {
  const currencyValidatorStub = makesCurrencyValidatorStub()
  const recordTransactionStub = makeRecordTransactionStub()
  const sut = new TransactionController(currencyValidatorStub, recordTransactionStub)
  return {
    sut,
    recordTransactionStub,
    currencyValidatorStub
  }
}

describe('Transaction Controller', () => {
  test('Should return 405 status if not allowed method is called', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        creditedUsername: 'some_username',
        value: '100.00'
      },
      user: {
        id: '1',
        username: 'any_username'
      },
      method: ''
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(methodNotAllowed())
  })

  test('Should return 400 status if creditedUsername is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        value: '100.00'
      },
      user: {
        id: '1',
        username: 'any_username'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('creditedUsername')))
  })

  test('Should return 400 status if value is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        creditedUsername: 'some_username'
      },
      user: {
        id: '1',
        username: 'any_username'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('value')))
  })

  test('Should return 400 status if username and creditedUsername are equal', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        creditedUsername: 'any_username',
        value: '100.00'
      },
      user: {
        id: '1',
        username: 'any_username'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('creditedUsername')))
  })

  test('Should call CurrencyValidator with correct value', async () => {
    const { sut, currencyValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(currencyValidatorStub, 'isValid')
    await sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith('100.00')
  })

  test('Should return 500 status if CurrencyValidator throws', async () => {
    const { sut, currencyValidatorStub } = makeSut()
    jest.spyOn(currencyValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should 400 status if CurrencyValidator returns false', async () => {
    const { sut, currencyValidatorStub } = makeSut()
    jest.spyOn(currencyValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('value')))
  })

  test('Should call RecordTransaction with correct values', async () => {
    const { sut, recordTransactionStub } = makeSut()
    const recordSpy = jest.spyOn(recordTransactionStub, 'record')
    await sut.handle(request)
    expect(recordSpy).toHaveBeenCalledWith({
      debitedUsername: 'any_username',
      creditedUsername: 'some_username',
      value: '100.00'
    })
  })

  test('Should return 500 status if RecordTransaction throws', async () => {
    const { sut, recordTransactionStub } = makeSut()
    jest.spyOn(recordTransactionStub, 'record').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 400 status if RecordTransaction recorded returns false', async () => {
    const { sut, recordTransactionStub } = makeSut()
    jest.spyOn(recordTransactionStub, 'record').mockReturnValueOnce(Promise.resolve({
      recorded: false,
      message: 'any_message'
    }))
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new TransactionError('any_message')))
  })

  test('Should return a message on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(okResponse('Transaction succesfully recorded'))
  })
})

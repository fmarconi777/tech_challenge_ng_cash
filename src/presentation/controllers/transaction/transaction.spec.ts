import { RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { TransactionController } from './transaction'

const request = {
  body: {
    cashInUsername: 'some_username',
    credit: '100.00'
  },
  user: {
    id: '1',
    username: 'any_username'
  }
}

const makeRecordTransactionStub = (): RecordTransaction => {
  class RecordTransactionStub implements RecordTransaction {
    async record (transactionData: TransactionData): Promise<string> {
      return 'Transaction succesfully recorded'
    }
  }
  return new RecordTransactionStub()
}

type Subtypes = {
  sut: TransactionController
  recordTransactionStub: RecordTransaction
}

const makeSut = (): Subtypes => {
  const recordTransactionStub = makeRecordTransactionStub()
  const sut = new TransactionController(recordTransactionStub)
  return {
    sut,
    recordTransactionStub
  }
}

describe('Transaction Controller', () => {
  test('Should return 400 status if cashInUsername is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        credit: '100.00'
      },
      user: {
        id: '1',
        username: 'any_username'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('cashInUsername')))
  })

  test('Should return 400 status if credit is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cashInUsername: 'some_username'
      },
      user: {
        id: '1',
        username: 'any_username'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('credit')))
  })

  test('Should return 400 status if username and cashInUsername are equal', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        cashInUsername: 'any_username',
        credit: '100.00'
      },
      user: {
        id: '1',
        username: 'any_username'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('cashInUsername')))
  })

  test('Should call RecordTransaction with correct values', async () => {
    const { sut, recordTransactionStub } = makeSut()
    const recordSpy = jest.spyOn(recordTransactionStub, 'record')
    await sut.handle(request)
    expect(recordSpy).toHaveBeenCalledWith({
      cashOutUsername: 'any_username',
      cashInUsername: 'some_username',
      credit: '100.00'
    })
  })
})

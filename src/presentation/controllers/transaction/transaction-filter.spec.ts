import { FilterData, LoadFilteredCashTransactions, RecordsData } from './transaction-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed, okResponse, serverError } from '../../helpers/http-helper'
import { TransactionFilterController } from './transaction-filter'

const httpRequest = {
  user: {
    id: '1',
    username: 'any_username'
  },
  method: 'GET',
  param: 'cashIn'
}

const makeLoadFilteredCashTransactionsStub = (): LoadFilteredCashTransactions => {
  class LoadFilteredCashTransactionsStub implements LoadFilteredCashTransactions {
    async load (filterData: FilterData): Promise<RecordsData[]> {
      return [{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]
    }
  }
  return new LoadFilteredCashTransactionsStub()
}

type Subtypes = {
  sut: TransactionFilterController
  loadFilteredCashTransactionsStub: LoadFilteredCashTransactions
}

const makeSut = (): Subtypes => {
  const loadFilteredCashTransactionsStub = makeLoadFilteredCashTransactionsStub()
  const sut = new TransactionFilterController(loadFilteredCashTransactionsStub)
  return {
    sut,
    loadFilteredCashTransactionsStub
  }
}

describe('Transaction Filter Controller', () => {
  test('Should return 405 status if not allowed method is called', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      user: {
        id: '1',
        username: 'any_username'
      },
      method: ''
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(methodNotAllowed())
  })

  describe('GET method', () => {
    test('Should return 400 status if not allowed param is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        method: 'GET',
        param: 'invalid_param'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('expected cashIn or cashOut params')))
    })

    test('Should call LoadFilteredCashTransactions with correct values', async () => {
      const { sut, loadFilteredCashTransactionsStub } = makeSut()
      const loadSpy = jest.spyOn(loadFilteredCashTransactionsStub, 'load')
      await sut.handle(httpRequest)
      expect(loadSpy).toHaveBeenCalledWith({
        userId: 1,
        filter: 'creditedAccountId'
      })
    })

    test('Should call LoadFilteredCashTransactions with correct values', async () => {
      const { sut, loadFilteredCashTransactionsStub } = makeSut()
      const loadSpy = jest.spyOn(loadFilteredCashTransactionsStub, 'load')
      await sut.handle({
        user: {
          id: '1',
          username: 'any_username'
        },
        method: 'GET',
        param: 'cashOut'
      })
      expect(loadSpy).toHaveBeenCalledWith({
        userId: 1,
        filter: 'debitedAccountId'
      })
    })

    test('Should return 500 status if LoadTransactions throws', async () => {
      const { sut, loadFilteredCashTransactionsStub } = makeSut()
      jest.spyOn(loadFilteredCashTransactionsStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError())
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(okResponse([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]))
    })
  })
})
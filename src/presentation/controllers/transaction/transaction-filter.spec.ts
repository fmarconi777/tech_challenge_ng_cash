import { FilterData, LoadFilterByCashTransactions, LoadFilterByDateTransactions, RecordsData, TimePeriod, Validator } from './transaction-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, methodNotAllowed, ok, serverError } from '../../helpers/http-helper'
import { TransactionFilterController } from './transaction-filter'

const httpRequest = {
  user: {
    id: '1',
    username: 'any_username'
  },
  method: 'GET',
  param: 'cashIn'
}

const makeLoadFilterByCashTransactionsStub = (): LoadFilterByCashTransactions => {
  class LoadFilterByCashTransactionsStub implements LoadFilterByCashTransactions {
    async loadByCash (filterData: FilterData): Promise<RecordsData[]> {
      return [{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]
    }
  }
  return new LoadFilterByCashTransactionsStub()
}

const makeLoadFilterByDateTransactionsStub = (): LoadFilterByDateTransactions => {
  class LoadFilterByDateTransactionsStub implements LoadFilterByDateTransactions {
    async loadByDate (timePeriod: TimePeriod): Promise<RecordsData[]> {
      return [{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]
    }
  }
  return new LoadFilterByDateTransactionsStub()
}

const makeDateValidatorStub = (): Validator => {
  class DateValidatorStub implements Validator {
    isValid (param: string): boolean {
      return true
    }
  }
  return new DateValidatorStub()
}

type Subtypes = {
  sut: TransactionFilterController
  loadFilterByCashTransactionsStub: LoadFilterByCashTransactions
  dateValidatorStub: Validator
  loadFilterByDateTransactionsStub: LoadFilterByDateTransactions
}

const makeSut = (): Subtypes => {
  const loadFilterByDateTransactionsStub = makeLoadFilterByDateTransactionsStub()
  const dateValidatorStub = makeDateValidatorStub()
  const loadFilterByCashTransactionsStub = makeLoadFilterByCashTransactionsStub()
  const sut = new TransactionFilterController(loadFilterByCashTransactionsStub, dateValidatorStub, loadFilterByDateTransactionsStub)
  return {
    sut,
    loadFilterByCashTransactionsStub,
    dateValidatorStub,
    loadFilterByDateTransactionsStub
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
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('expected cashIn or cashOut params on route')))
    })

    test('Should call LoadFilterByCashTransactions with correct values', async () => {
      const { sut, loadFilterByCashTransactionsStub } = makeSut()
      const loadByCashSpy = jest.spyOn(loadFilterByCashTransactionsStub, 'loadByCash')
      await sut.handle(httpRequest)
      expect(loadByCashSpy).toHaveBeenCalledWith({
        userId: 1,
        filter: 'creditedAccountId'
      })
    })

    test('Should call LoadFilterByCashTransactions with correct values', async () => {
      const { sut, loadFilterByCashTransactionsStub } = makeSut()
      const loadByCashSpy = jest.spyOn(loadFilterByCashTransactionsStub, 'loadByCash')
      await sut.handle({
        user: {
          id: '1',
          username: 'any_username'
        },
        method: 'GET',
        param: 'cashOut'
      })
      expect(loadByCashSpy).toHaveBeenCalledWith({
        userId: 1,
        filter: 'debitedAccountId'
      })
    })

    test('Should return 500 status if LoadTransactions throws', async () => {
      const { sut, loadFilterByCashTransactionsStub } = makeSut()
      jest.spyOn(loadFilterByCashTransactionsStub, 'loadByCash').mockReturnValueOnce(Promise.reject(new Error()))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError())
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(ok([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]))
    })
  })

  describe('POST method', () => {
    test('Should return 400 status if not allowed param is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '',
          endDate: ''
        },
        method: 'POST',
        param: 'invalid_param'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('expected "date" param on route')))
    })

    test('Should return 400 status if startDate is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('startDate')))
    })

    test('Should return 400 status if endDate is not provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('endDate')))
    })

    test('Should call DateValidator with correct value', async () => {
      const { sut, dateValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(dateValidatorStub, 'isValid')
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: 'invalid_date',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('invalid_date')
    })

    test('Should return 500 status if DateValidator returns an error', async () => {
      const { sut, dateValidatorStub } = makeSut()
      jest.spyOn(dateValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '2022-11-28',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError())
    })

    test('Should return 400 status if an invalid date is provided', async () => {
      const { sut, dateValidatorStub } = makeSut()
      jest.spyOn(dateValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: 'invalid_date',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('startDate')))
    })

    test('Should call LoadFilterByDateTransactions with correct value', async () => {
      const { sut, loadFilterByDateTransactionsStub } = makeSut()
      const loadByDateSpy = jest.spyOn(loadFilterByDateTransactionsStub, 'loadByDate')
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '2022-11-28',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      await sut.handle(httpRequest)
      expect(loadByDateSpy).toHaveBeenCalledWith({
        userId: 1,
        startDate: '2022-11-28',
        endDate: '2022-11-28'
      })
    })

    test('Should return 500 status if LoadFilterByDateTransactions returns an error', async () => {
      const { sut, loadFilterByDateTransactionsStub } = makeSut()
      jest.spyOn(loadFilterByDateTransactionsStub, 'loadByDate').mockReturnValueOnce(Promise.reject(new Error()))
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '2022-11-28',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError())
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        user: {
          id: '1',
          username: 'any_username'
        },
        body: {
          startDate: '2022-11-28',
          endDate: '2022-11-28'
        },
        method: 'POST',
        param: 'date'
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(ok([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }]))
    })
  })
})

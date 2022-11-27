import { InvalidParamError } from '../../errors'
import { badRequest, methodNotAllowed } from '../../helpers/http-helper'
import { TransactionFilterController } from './transaction-filter'

type Subtypes = {
  sut: TransactionFilterController
}

const makeSut = (): Subtypes => {
  const sut = new TransactionFilterController()
  return {
    sut
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
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('expected date, cashIn or cashOut params')))
    })
  })
})

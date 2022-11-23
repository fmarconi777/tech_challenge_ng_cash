import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { TransactionController } from './transaction'

type Subtypes = {
  sut: TransactionController
}

const makeSut = (): Subtypes => {
  const sut = new TransactionController()
  return {
    sut
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
})

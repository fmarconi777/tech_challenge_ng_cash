import { MissingParamError } from '../../errors'
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
  test('Should return 400 status if username is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
  })
})

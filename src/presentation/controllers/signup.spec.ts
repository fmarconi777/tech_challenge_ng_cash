import { SignUpController } from './singup'
import { MissingParamError } from './errors/missing-param-error'
import { badRequest } from './helpers/http-helper'

type SubTypes = {
  sut: SignUpController
}

const makeSut = (): SubTypes => {
  const sut = new SignUpController()
  return {
    sut
  }
}

describe('Singup Controller', () => {
  test('Should return 400 status if username is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
  })

  test('Should return 400 status if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})

import { SignUpController } from './singup'
import { MissingParamError } from './errors/missing-param-error'
import { badRequest } from './helpers/http-helper'
import { Validator } from '../protocols/validator'

const makeUserValidatorStub = (): Validator => {
  class UserValidatorStub implements Validator {
    isValid (username: string): boolean {
      return true
    }
  }
  return new UserValidatorStub()
}

type SubTypes = {
  sut: SignUpController
  userValidatorStub: Validator
}

const makeSut = (): SubTypes => {
  const userValidatorStub = makeUserValidatorStub()
  const sut = new SignUpController(userValidatorStub)
  return {
    sut,
    userValidatorStub
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

  test('Should call UserValidator with correct param', async () => {
    const { sut, userValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(userValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_name')
  })
})

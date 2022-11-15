import { SignUpController } from './singup'
import { MissingParamError } from './errors/missing-param-error'
import { badRequest, serverError } from './helpers/http-helper'
import { Validator } from '../protocols/validator'
import { InvalidParamError } from './errors/invalid-param-error'

const makeUserValidatorStub = (): Validator => {
  class UserValidatorStub implements Validator {
    isValid (username: string): boolean {
      return true
    }
  }
  return new UserValidatorStub()
}

const makePasswordValidatorStub = (): Validator => {
  class PasswordValidatorStub implements Validator {
    isValid (param: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

type SubTypes = {
  sut: SignUpController
  userValidatorStub: Validator
  passwordValidatorStub: Validator
}

const makeSut = (): SubTypes => {
  const passwordValidatorStub = makePasswordValidatorStub()
  const userValidatorStub = makeUserValidatorStub()
  const sut = new SignUpController(userValidatorStub, passwordValidatorStub)
  return {
    sut,
    userValidatorStub,
    passwordValidatorStub
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

  test('Should return 500 status if UserValidator returns an error', async () => {
    const { sut, userValidatorStub } = makeSut()
    jest.spyOn(userValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 400 status if an invalid username is provided', async () => {
    const { sut, userValidatorStub } = makeSut()
    jest.spyOn(userValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'invalid_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('username')))
  })

  test('Should call PasswordValidator with correct param', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should return 500 status if PasswordValidator returns an error', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 400 status if an invalid password is provided', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })
})

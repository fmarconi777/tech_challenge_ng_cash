import { Authentication, AuthenticationModel } from './singup-protocols'
import { MissingParamError } from '../../errors'
import { badRequest, okResponse, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

const fakeUser = {
  username: 'fake_user',
  password: 'fake_password'
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
      return await Promise.resolve('access_token')
    }
  }
  return new AuthenticationStub()
}

type SubTypes = {
  sut: LoginController
  authenticationStub: Authentication
}

const makeSut = (): SubTypes => {
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(authenticationStub)
  return {
    sut,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 status if no username is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('username')))
  })

  test('Should return 400 status if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: fakeUser
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(fakeUser)
  })

  test('Should return 500 status if Authentication returns an error', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: fakeUser
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 401 status if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = {
      body: {
        username: 'invalid_user',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 status if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: fakeUser
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(okResponse('access_token'))
  })
})

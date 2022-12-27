import { LoginController } from './login'
import { Authentication, AuthenticationModel } from './login-protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, methodNotAllowed, ok, serverError, unauthorized } from '@/presentation/helpers/http-helper'

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

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(authenticationStub)
  return {
    sut,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 405 status if not allowed method is called', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: fakeUser,
      method: ''
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(methodNotAllowed())
  })

  test('Should return 400 status if no username is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      },
      method: 'POST'
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('username')))
  })

  test('Should return 400 status if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username'
      },
      method: 'POST'
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: fakeUser,
      method: 'POST'
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(fakeUser)
  })

  test('Should return 500 status if Authentication returns an error', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: fakeUser,
      method: 'POST'
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
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 200 status if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: fakeUser,
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok('access_token'))
  })
})

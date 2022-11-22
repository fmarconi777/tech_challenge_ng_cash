import { UserModel } from '../../domain/models/user'
import { LoadUserByToken } from '../../domain/use-cases/load-user-by-token/load-user-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, okResponse, serverError } from '../helpers/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

const fakeRequest = (): HttpRequest => ({
  header: 'any_token'
})

const fakeUser = (): UserModel => ({
  id: 'any_id',
  username: 'any_username',
  password: 'any_password',
  accountId: 'any_accountId'
})

const makeLoadUserByTokenStub = (): LoadUserByToken => {
  class LoadUserByTokenStub implements LoadUserByTokenStub {
    async load (accessToken: string, role?: string): Promise<UserModel | null> {
      return await new Promise(resolve => resolve(fakeUser()))
    }
  }
  return new LoadUserByTokenStub()
}

type SubTypes = {
  sut: AuthMiddleware
  loadUserByTokenStub: LoadUserByToken
}

const makeSut = (role?: string): SubTypes => {
  const loadUserByTokenStub = makeLoadUserByTokenStub()
  const sut = new AuthMiddleware(loadUserByTokenStub, role)
  return {
    sut,
    loadUserByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if there is no token o header', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadUserByToken with correct Token', async () => {
    const role = 'any_role'
    const { sut, loadUserByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadUserByTokenStub, 'load')
    await sut.handle(fakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 500 if LoadUserByToken throws', async () => {
    const role = 'any_role'
    const { sut, loadUserByTokenStub } = makeSut(role)
    jest.spyOn(loadUserByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenStub } = makeSut()
    jest.spyOn(loadUserByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadUserByToken returns an user', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeRequest())
    expect(httpResponse).toEqual(okResponse({ userId: 'any_id' }))
  })
})

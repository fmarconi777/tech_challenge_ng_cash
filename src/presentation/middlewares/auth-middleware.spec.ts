import { UserModel } from '../../domain/models/user'
import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'
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

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByTokenStub {
    async load (accessToken: string, role?: string): Promise<UserModel> {
      return await new Promise(resolve => resolve(fakeUser()))
    }
  }
  return new LoadAccountByTokenStub()
}

type SubTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SubTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if there is no token o header', async () => {
    const { sut } = makeSut()
    const respostaHttp = await sut.handle({})
    expect(respostaHttp).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct Token', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
})

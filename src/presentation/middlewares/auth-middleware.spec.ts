import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'
import { AuthMiddleware } from './auth-middleware'

type SubTypes = {
  sut: AuthMiddleware
}

const makeSut = (): SubTypes => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if there is no token o header', async () => {
    const { sut } = makeSut()
    const respostaHttp = await sut.handle({})
    expect(respostaHttp).toEqual(forbidden(new AccessDeniedError()))
  })
})

import { BalanceModel, LoadBalance } from './balance-protocols'
import { BalanceController } from './balance'
import { methodNotAllowed, ok, serverError } from '@/presentation/helpers/http-helper'

const makeLoadBalanceStub = (): LoadBalance => {
  class LoadBalanceStub implements LoadBalance {
    async load (id: number): Promise<BalanceModel> {
      return await Promise.resolve({ balance: 'any_balance' })
    }
  }
  return new LoadBalanceStub()
}

type Subtypes = {
  sut: BalanceController
  loadBalanceStub: LoadBalance
}

const makeSut = (): Subtypes => {
  const loadBalanceStub = makeLoadBalanceStub()
  const sut = new BalanceController(loadBalanceStub)
  return {
    sut,
    loadBalanceStub
  }
}

describe('Balance Controller', () => {
  test('Should return 405 status if not allowed method is called', async () => {
    const { sut } = makeSut()
    const httpRequest = { user: { id: '1', username: 'any_username' }, method: 'POST' }
    const balance = await sut.handle(httpRequest)
    expect(balance).toEqual(methodNotAllowed())
  })

  test('Should call LoadBalance with correct userId', async () => {
    const { sut, loadBalanceStub } = makeSut()
    const loadSpy = jest.spyOn(loadBalanceStub, 'load')
    const httpRequest = { user: { id: '1', username: 'any_username' }, method: 'GET' }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(1)
  })

  test('Should return 500 status if LoadBalance throws', async () => {
    const { sut, loadBalanceStub } = makeSut()
    jest.spyOn(loadBalanceStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = { user: { id: '1', username: 'any_username' }, method: 'GET' }
    const balance = await sut.handle(httpRequest)
    expect(balance).toEqual(serverError())
  })

  test('Should return a balance on success', async () => {
    const { sut } = makeSut()
    const httpRequest = { user: { id: '1', username: 'any_username' }, method: 'GET' }
    const balance = await sut.handle(httpRequest)
    expect(balance).toEqual(ok({ balance: 'any_balance' }))
  })
})

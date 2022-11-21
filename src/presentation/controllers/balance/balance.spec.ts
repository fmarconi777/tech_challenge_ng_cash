import { BalanceModel, LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { okResponse, serverError } from '../helpers/http-helper'
import { BalanceController } from './balance'

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
  test('Should call LoadBalance with correct userId', async () => {
    const { sut, loadBalanceStub } = makeSut()
    const loadSpy = jest.spyOn(loadBalanceStub, 'load')
    const httpRequest = { userId: '1' }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadBalance throws', async () => {
    const { sut, loadBalanceStub } = makeSut()
    jest.spyOn(loadBalanceStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = { userId: '1' }
    const balance = await sut.handle(httpRequest)
    expect(balance).toEqual(serverError())
  })

  test('Should return a balance on success', async () => {
    const { sut } = makeSut()
    const httpRequest = { userId: '1' }
    const balance = await sut.handle(httpRequest)
    expect(balance).toEqual(okResponse({ balance: 'any_balance' }))
  })
})

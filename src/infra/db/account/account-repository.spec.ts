import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdORM } from '../../protocols/account/load-account-by-id-orm'
import { AccountRepository } from './account-repository'

const fakeAccount = {
  id: '1',
  balance: '100.00'
}

const makeLoadAccountByIdORMStub = (): LoadAccountByIdORM => {
  class LoadAccountByIdORMStub implements LoadAccountByIdORM {
    async loadById (id: number): Promise<AccountModel | null> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new LoadAccountByIdORMStub()
}

type SubTypes = {
  sut: AccountRepository
  loadAccountByIdORMStub: LoadAccountByIdORM
}

const makeSut = (): SubTypes => {
  const loadAccountByIdORMStub = makeLoadAccountByIdORMStub()
  const sut = new AccountRepository(loadAccountByIdORMStub)
  return {
    sut,
    loadAccountByIdORMStub
  }
}

describe('Account Repository', () => {
  test('Should call LoadAccountByIdORM with correct value', async () => {
    const { sut, loadAccountByIdORMStub } = makeSut()
    const loadByUserIdSpy = jest.spyOn(loadAccountByIdORMStub, 'loadById')
    await sut.loadById(1)
    expect(loadByUserIdSpy).toHaveBeenCalledWith(1)
  })

  test('Should throw if LoadAccountByIdORM throws', async () => {
    const { sut, loadAccountByIdORMStub } = makeSut()
    jest.spyOn(loadAccountByIdORMStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const user = sut.loadById(1)
    await expect(user).rejects.toThrow()
  })

  test('Should return null if LoadAccountByIdORM returns null', async () => {
    const { sut, loadAccountByIdORMStub } = makeSut()
    jest.spyOn(loadAccountByIdORMStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const user = await sut.loadById(1)
    expect(user).toBeNull()
  })
})

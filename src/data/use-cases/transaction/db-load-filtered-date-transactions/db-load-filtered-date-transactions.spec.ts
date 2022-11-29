import { UserModel } from '../../../../domain/models/user'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'
import { DbLoadFilteredDateTransactions } from './db-load-filtered-date-transactions'

const timePeriod = {
  userId: 1,
  startDate: '2022-01-01',
  endDate: '2022-11-01'
}

const fakeUser = {
  id: '1',
  username: 'any_username',
  password: 'any_password',
  accountId: '1'
}

const makeLoadUserByIdRepositoryStub = (): LoadUserByIdRepository => {
  class LoadUserByIdRepositoryStub implements LoadUserByIdRepository {
    async loadById (id: number): Promise<UserModel | null> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByIdRepositoryStub()
}

type SubTypes = {
  sut: DbLoadFilteredDateTransactions
  loadUserByIdRepositoryStub: LoadUserByIdRepository
}

const makeSut = (): SubTypes => {
  const loadUserByIdRepositoryStub = makeLoadUserByIdRepositoryStub()
  const sut = new DbLoadFilteredDateTransactions(loadUserByIdRepositoryStub)
  return {
    sut,
    loadUserByIdRepositoryStub
  }
}

describe('DbLoadFilteredDateTransactions', () => {
  test('Should call LoadUserByIdRepository with correct value', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById')
    await sut.load(timePeriod)
    expect(loadByIdSpy).toHaveBeenCalledWith(1)
  })
})

import { UserModel } from '../../../domain/models/user'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'
import { DbRecordTransaction } from './db-record-transaction'

const transactionData = {
  cashOutUsername: 'any_username',
  cashInUsername: 'some_username',
  credit: '100.00'
}

const makeLoadUserByUsernameRepositoryStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
    async loadByUsername (username: string): Promise<UserModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadUserByUsernameRepositoryStub()
}

type SubTypes = {
  sut: DbRecordTransaction
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
}

const makeSut = (): SubTypes => {
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const sut = new DbRecordTransaction(loadUserByUsernameRepositoryStub)
  return {
    sut,
    loadUserByUsernameRepositoryStub
  }
}

describe('DbRecordTransaction', () => {
  test('Should call LoadUserByUsernameRepository with correct value', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    const loadByUsernameSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'loadByUsername')
    await sut.record(transactionData)
    expect(loadByUsernameSpy).toHaveBeenCalledWith('some_username')
  })
})

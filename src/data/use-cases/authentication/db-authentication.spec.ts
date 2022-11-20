import { UserModel } from '../../../domain/models/user'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'
import { DbAuthentication } from './db-authentication'

const fakeAuthenticationParams = {
  username: 'fake_user',
  password: 'fake_password'
}

const fakeUser = {
  id: 'fake_id',
  username: 'fake_username',
  password: 'fake_password',
  accountId: 'fake_accountId'
}

const makeLoadUserByUsernameRepositoryStub = (): LoadUserByUsernameRepository => {
  class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
    async load (username: string): Promise<UserModel> {
      return await Promise.resolve(fakeUser)
    }
  }
  return new LoadUserByUsernameRepositoryStub()
}

type SubTypes = {
  sut: DbAuthentication
  loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
}

const makeSut = (): SubTypes => {
  const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepositoryStub()
  const sut = new DbAuthentication(loadUserByUsernameRepositoryStub)
  return {
    sut,
    loadUserByUsernameRepositoryStub
  }
}

describe('DbAuthentication', () => {
  test('Should call LoadUserByUsernameRepository with correct username', async () => {
    const { sut, loadUserByUsernameRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'load')
    await sut.auth(fakeAuthenticationParams)
    expect(loadSpy).toHaveBeenLastCalledWith(fakeAuthenticationParams.username)
  })
})

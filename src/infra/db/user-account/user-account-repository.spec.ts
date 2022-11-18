import { UserData } from '../../../domain/use-cases/add-user-account'
import { AddUserAccountORM } from '../../protocols/add-user-account-orm'
import { UserAccountRepository } from './user-account-repository'

const userData = {
  username: 'valid_username',
  password: 'hashed_password'
}

const makeAddUserAccountORMStub = (): AddUserAccountORM => {
  class AddUserAccountORMStub implements AddUserAccountORM {
    async addUserAccount (userData: UserData): Promise<string> {
      return await Promise.resolve('Account succesfully created')
    }
  }
  return new AddUserAccountORMStub()
}

type SubTypes = {
  sut: UserAccountRepository
  addUserAccountORMStub: AddUserAccountORM
}

const makeSut = (): SubTypes => {
  const addUserAccountORMStub = makeAddUserAccountORMStub()
  const sut = new UserAccountRepository(addUserAccountORMStub)
  return {
    sut,
    addUserAccountORMStub
  }
}

describe('UserAccount Repository', () => {
  test('Should call ORM with correct values', async () => {
    const { sut, addUserAccountORMStub } = makeSut()
    const addUserAccountSpy = jest.spyOn(addUserAccountORMStub, 'addUserAccount')
    await sut.addUserAccount(userData)
    expect(addUserAccountSpy).toHaveBeenCalledWith(userData)
  })
})

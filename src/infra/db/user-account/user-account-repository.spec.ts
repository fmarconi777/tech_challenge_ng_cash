import { AddUserAccountORM } from './user-account-protocols'
import { UserAccountRepository } from './user-account-repository'
import { UserData } from '@/domain/use-cases/signup/add-user-account/add-user-account'

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

type SutTypes = {
  sut: UserAccountRepository
  addUserAccountORMStub: AddUserAccountORM
}

const makeSut = (): SutTypes => {
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

  test('Should throw if ORM throws', async () => {
    const { sut, addUserAccountORMStub } = makeSut()
    jest.spyOn(addUserAccountORMStub, 'addUserAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const userAccount = sut.addUserAccount(userData)
    await expect(userAccount).rejects.toThrow()
  })

  test('Should return a message on success', async () => {
    const { sut } = makeSut()
    const userAccount = await sut.addUserAccount(userData)
    expect(userAccount).toEqual('Account succesfully created')
  })
})

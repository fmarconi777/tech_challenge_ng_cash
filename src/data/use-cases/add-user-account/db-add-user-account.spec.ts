import { Hasher } from '../../protocols/crytography/hasher'
import { DbAddUserAccount } from './db-add-user-accout'

const userData = {
  username: 'valid_username',
  password: 'valid_password'
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (password: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

type SubTypes = {
  sut: DbAddUserAccount
  hasherStub: Hasher
}

const makeSut = (): SubTypes => {
  const hasherStub = makeHasherStub()
  const sut = new DbAddUserAccount(hasherStub)
  return {
    sut,
    hasherStub
  }
}

describe('DbAddUserAccount', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(userData)
    expect(hashSpy).toHaveBeenCalledWith(userData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const userAccount = sut.add(userData)
    await expect(userAccount).rejects.toThrow()
  })
})

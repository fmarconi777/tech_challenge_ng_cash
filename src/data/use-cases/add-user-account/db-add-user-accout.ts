import { AddUserAccount, UserData, Hasher, AddUserAccountRepository } from './db-add-user-account-protocols'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserAccountRepository: AddUserAccountRepository
  ) {}

  async addUserAccount (userData: UserData): Promise<string | null> {
    const hashedPassword = await this.hasher.hash(userData.password)
    await this.addUserAccountRepository.addUserAccount(Object.assign({}, userData, { password: hashedPassword }))
    return null
  }
}

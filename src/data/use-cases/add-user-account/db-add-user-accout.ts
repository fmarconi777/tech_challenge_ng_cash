import { AddUserAccount, UserData, Hasher, AddUserAccountRepository, CheckUserByUsernameRepository } from './db-add-user-account-protocols'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserAccountRepository: AddUserAccountRepository,
    private readonly checkUserByUsernameRepository: CheckUserByUsernameRepository
  ) {}

  async addUserAccount (userData: UserData): Promise<string | null> {
    const user = await this.checkUserByUsernameRepository.checkByUsername(userData.username)
    if (!user) {
      const hashedPassword = await this.hasher.hash(userData.password)
      const userAccount = await this.addUserAccountRepository.addUserAccount(Object.assign({}, userData, { password: hashedPassword }))
      return userAccount
    }
    return null
  }
}

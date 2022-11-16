import { AddUserAccount, UserData, Hasher } from './db-add-user-account-protocols'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly hasher: Hasher
  ) {}

  async add (userData: UserData): Promise<string | null> {
    await this.hasher.hash(userData.password)
    return null
  }
}

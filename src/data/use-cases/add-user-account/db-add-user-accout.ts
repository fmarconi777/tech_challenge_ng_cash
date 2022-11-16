import { AddUserAccount, UserData } from '../../../domain/use-cases/add-user-account'
import { Hasher } from '../../protocols/crytography/hasher'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly hasher: Hasher
  ) {}

  async add (userData: UserData): Promise<string | null> {
    await this.hasher.hash(userData.password)
    return null
  }
}

import { AddUserAccountRepository, UserData } from '../../../data/use-cases/add-user-account/db-add-user-account-protocols'
import { AddUserAccountORM } from '../../protocols/add-user-account-orm'

export class UserAccountRepository implements AddUserAccountRepository {
  constructor (
    private readonly addUserAccountORM: AddUserAccountORM
  ) {}

  async addUserAccount (userData: UserData): Promise<string> {
    await this.addUserAccountORM.addUserAccount(userData)
    return ''
  }
}

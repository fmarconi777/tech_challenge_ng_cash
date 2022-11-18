import { AddUserAccountRepository, UserData } from '../../../data/use-cases/add-user-account/db-add-user-account-protocols'
import { AddUserAccountORM } from '../../protocols/user-account/add-user-account-orm'

export class UserAccountRepository implements AddUserAccountRepository {
  constructor (
    private readonly addUserAccountORM: AddUserAccountORM
  ) {}

  async addUserAccount (userData: UserData): Promise<string> {
    return await this.addUserAccountORM.addUserAccount(userData)
  }
}

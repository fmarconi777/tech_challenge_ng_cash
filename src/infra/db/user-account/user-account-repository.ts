import { AddUserAccountRepository, UserData } from '../../../data/use-cases/signup/add-user-account/db-add-user-account-protocols'
import { AddUserAccountORM } from './user-account-protocols'

export class UserAccountRepository implements AddUserAccountRepository {
  constructor (
    private readonly addUserAccountORM: AddUserAccountORM
  ) {}

  async addUserAccount (userData: UserData): Promise<string> {
    return await this.addUserAccountORM.addUserAccount(userData)
  }
}

import { CheckUserByUsernameRepository } from '../../../data/use-cases/add-user-account/db-add-user-account-protocols'
import { UserModel } from '../../../domain/models/user'
import { CheckUserByUserNameORM } from '../../protocols/check-user-by-user-name-orm'

export class UserRepository implements CheckUserByUsernameRepository {
  constructor (
    private readonly checkUserByUserNameORM: CheckUserByUserNameORM
  ) {}

  async checkByUsername (username: string): Promise<UserModel | null> {
    return await this.checkUserByUserNameORM.checkByUsername(username)
  }
}

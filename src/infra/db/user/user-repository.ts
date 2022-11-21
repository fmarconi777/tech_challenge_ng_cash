import { CheckUserByUsernameRepository } from '../../../data/use-cases/add-user-account/db-add-user-account-protocols'
import { CheckUserByIdRepository } from '../../../data/use-cases/load-balance/db-load-balance-protocols'
import { UserModel } from '../../../domain/models/user'
import { CheckUserByUserNameORM, CheckUserByIdORM } from './user-protocols'

export class UserRepository implements CheckUserByUsernameRepository, CheckUserByIdRepository {
  constructor (
    private readonly checkUserByUserNameORM: CheckUserByUserNameORM,
    private readonly checkUserByIdORM: CheckUserByIdORM
  ) {}

  async checkByUsername (username: string): Promise<UserModel | null> {
    return await this.checkUserByUserNameORM.checkByUsername(username)
  }

  async checkById (id: number): Promise<UserModel | null> {
    return await this.checkUserByIdORM.checkById(id)
  }
}

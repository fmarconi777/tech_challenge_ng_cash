import { LoadUserByUsernameRepository } from '../../../data/use-cases/add-user-account/db-add-user-account-protocols'
import { LoadUserByIdRepository } from '../../../data/use-cases/load-balance/db-load-balance-protocols'
import { UserModel } from '../../../domain/models/user'
import { LoadUserByUserNameORM, LoadUserByIdORM } from './user-protocols'

export class UserRepository implements LoadUserByUsernameRepository, LoadUserByIdRepository {
  constructor (
    private readonly loadUserByUserNameORM: LoadUserByUserNameORM,
    private readonly loadUserByIdORM: LoadUserByIdORM
  ) {}

  async loadByUsername (username: string): Promise<UserModel | null> {
    return await this.loadUserByUserNameORM.loadByUsername(username)
  }

  async loadById (id: number): Promise<UserModel | null> {
    return await this.loadUserByIdORM.loadById(id)
  }
}

import { UserModel } from '../../../domain/models/user'

export interface LoadUserByUserNameORM {
  loadByUsername: (username: string) => Promise<UserModel | null>
}

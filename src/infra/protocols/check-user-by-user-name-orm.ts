import { UserModel } from '../../domain/models/user'

export interface CheckUserByUserNameORM {
  checkByUsername: (username: string) => Promise<UserModel | null>
}

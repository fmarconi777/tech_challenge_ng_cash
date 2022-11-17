import { UserModel } from '../../../domain/models/user'

export interface CheckUserByUsernameRepository {
  checkByUsername: (username: string) => Promise<UserModel | null>
}

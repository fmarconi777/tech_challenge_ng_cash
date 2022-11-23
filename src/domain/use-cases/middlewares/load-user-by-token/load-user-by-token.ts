import { UserModel } from '../../../models/user'

export interface LoadUserByToken {
  load: (accessToken: string) => Promise<UserModel | null>
}

import { UserModel } from '../../models/user'

export interface LoadUserByToken {
  load: (accessToken: string, role?: string) => Promise<UserModel | null>
}

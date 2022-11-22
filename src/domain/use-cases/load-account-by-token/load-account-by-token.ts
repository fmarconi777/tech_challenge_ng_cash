import { UserModel } from '../../models/user'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<UserModel>
}

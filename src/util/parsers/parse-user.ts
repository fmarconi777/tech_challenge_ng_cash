import { UserModel } from '../../domain/models/user'

export const parseUser = (user: any): UserModel | null => {
  if (user) {
    return {
      id: String(user.id),
      username: String(user.username),
      password: String(user.password),
      accountId: String(user.accountId)
    }
  }
  return null
}

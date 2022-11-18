import { CheckUserByUsernameRepository } from '../../../../data/protocols/db/user-account/check-user-by-username-repository'
import { UserModel } from '../../../../domain/models/user'
import { Users } from '../../models/users'

export class SequelizeUserAdapter implements CheckUserByUsernameRepository {
  async checkByUsername (username: string): Promise<UserModel | null> {
    const user = await Users.findOne({ where: { username }, raw: true })
    return this.parseUser(user)
  }

  parseUser (user: Users | null): UserModel | null {
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
}

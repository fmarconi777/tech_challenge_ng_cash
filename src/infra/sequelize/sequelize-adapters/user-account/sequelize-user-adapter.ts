import { CheckUserByUsernameRepository } from '../../../../data/protocols/db/user-account/check-user-by-username-repository'
import { UserModel } from '../../../../domain/models/user'
import { Users } from '../../models/users'
import { parseUser } from '../../../../util/parsers/parse-user'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'

export class SequelizeUserAdapter implements CheckUserByUsernameRepository {
  async checkByUsername (username: string): Promise<UserModel | null> {
    await ConnectionHelper.reconnect()
    const user = await Users.findOne({ where: { username }, raw: true })
    return parseUser(user)
  }
}

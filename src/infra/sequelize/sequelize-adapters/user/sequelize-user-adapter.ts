import { CheckUserByUserNameORM } from '../sequelize-adapters-protocols'
import { UserModel } from '../../../../domain/models/user'
import { Users } from '../../models/users'
import { parseUser } from '../sequelize-parsers/parse-user'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'

export class SequelizeUserAdapter implements CheckUserByUserNameORM {
  async checkByUsername (username: string): Promise<UserModel | null> {
    await ConnectionHelper.reconnect()
    const user = await Users.findOne({ where: { username }, raw: true })
    return parseUser(user)
  }
}

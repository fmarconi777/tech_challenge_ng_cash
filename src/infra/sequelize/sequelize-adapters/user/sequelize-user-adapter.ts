import { CheckUserByUserNameORM } from '../sequelize-adapters-protocols'
import { UserModel } from '../../../../domain/models/user'
import { Users } from '../../models/users'
import { parseUser } from '../sequelize-parsers/parse-user'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { CheckUserByIdORM } from '../../../protocols/user/check-user-by-id-orm'

export class SequelizeUserAdapter implements CheckUserByUserNameORM, CheckUserByIdORM {
  async checkByUsername (username: string): Promise<UserModel | null> {
    await ConnectionHelper.reconnect()
    const user = await Users.findOne({ where: { username }, raw: true })
    return parseUser(user)
  }

  async checkById (id: number): Promise<UserModel | null> {
    return null
  }
}

import { LoadUserByUserNameORM, LoadUserByIdORM } from '../sequelize-adapters-protocols'
import { UserModel } from '../../../../domain/models/user'
import { Users } from '../../models/models'
import { parseUser } from '../sequelize-parsers/parse-user'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'

export class SequelizeUserAdapter implements LoadUserByUserNameORM, LoadUserByIdORM {
  async loadByUsername (username: string): Promise<UserModel | null> {
    await ConnectionHelper.reconnect()
    const user = await Users.findOne({ where: { username }, raw: true })
    return parseUser(user)
  }

  async loadById (id: number): Promise<UserModel | null> {
    await ConnectionHelper.reconnect()
    const user = await Users.findByPk(id, { raw: true })
    return parseUser(user)
  }
}

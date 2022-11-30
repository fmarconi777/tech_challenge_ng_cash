import { LoadUserByUserNameORM, LoadUserByIdORM } from '../sequelize-adapters-protocols'
import { parseUser } from '../sequelize-parsers/parse-user'
import { Users } from '@/infra/sequelize/models/models'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { UserModel } from '@/domain/models/user'

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

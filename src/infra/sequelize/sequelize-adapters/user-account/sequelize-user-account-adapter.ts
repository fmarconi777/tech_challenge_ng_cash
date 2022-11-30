import { AddUserAccountORM } from '../sequelize-adapters-protocols'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { Accounts } from '@/infra/sequelize/models/accounts'
import { Users } from '@/infra/sequelize/models/users'
import { UserData } from '@/domain/use-cases/signup/add-user-account/add-user-account'

export class SequelizeUserAccountAdapter implements AddUserAccountORM {
  async addUserAccount (userData: UserData): Promise<string> {
    await ConnectionHelper.reconnect()
    let transaction
    try {
      transaction = await ConnectionHelper.client.transaction()

      const balance: any = 100.00
      const account = await Accounts.create({ balance }, { transaction })

      await Users.create({
        username: userData.username,
        password: userData.password,
        accountId: account.id
      }, { transaction })

      await transaction.commit()

      return 'Account succesfully created'
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      throw error
    }
  }
}

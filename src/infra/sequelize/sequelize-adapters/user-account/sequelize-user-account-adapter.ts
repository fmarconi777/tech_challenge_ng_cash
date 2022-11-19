import { UserData } from '../../../../domain/use-cases/add-user-account'
import { AddUserAccountORM } from '../../../protocols/user-account/add-user-account-orm'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { Accounts } from '../../models/accounts'
import { Users } from '../../models/users'

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

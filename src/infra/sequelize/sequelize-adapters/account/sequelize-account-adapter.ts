import { AccountModel } from '../../../../domain/models/account'
import { LoadAccountByIdORM } from '../sequelize-adapters-protocols'
import { Accounts } from '../../models/models'

export class SequelizeAccountAdapter implements LoadAccountByIdORM {
  async loadById (id: number): Promise<AccountModel | null> {
    return this.parseAccount(await Accounts.findByPk(id, { raw: true }))
  }

  parseAccount (account: any): AccountModel | null {
    if (account) {
      return {
        id: String(account.id),
        balance: String(account.balance)
      }
    }
    return null
  }
}

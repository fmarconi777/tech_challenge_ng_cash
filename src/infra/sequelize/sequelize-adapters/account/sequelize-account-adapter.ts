import { AccountModel } from '../../../../domain/models/account'
import { LoadAccountByIdORM } from '../../../protocols/account/load-account-by-id-orm'

export class SequelizeAccountAdapter implements LoadAccountByIdORM {
  async loadById (id: number): Promise<AccountModel | null> {
    return null
  }
}

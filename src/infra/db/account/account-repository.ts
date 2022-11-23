import { LoadAccountByIdRepository } from '../../../data/use-cases/balance/load-balance/db-load-balance-protocols'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdORM } from '../../protocols/account/load-account-by-id-orm'

export class AccountRepository implements LoadAccountByIdRepository {
  constructor (private readonly loadAccountByIdORM: LoadAccountByIdORM) {}

  async loadById (id: number): Promise<AccountModel | null> {
    return await this.loadAccountByIdORM.loadById(id)
  }
}

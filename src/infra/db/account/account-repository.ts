import { LoadAccountByIdRepository } from '../../../data/use-cases/load-balance/db-load-balance-protocols'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdORM } from '../../protocols/account/load-account-by-id-orm'

export class AccountRepository implements LoadAccountByIdRepository {
  constructor (private readonly loadAccountByIdORM: LoadAccountByIdORM) {}

  async loadById (id: number): Promise<AccountModel | null> {
    await this.loadAccountByIdORM.loadById(id)
    return null
  }
}

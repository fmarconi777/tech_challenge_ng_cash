import { LoadAccountByIdORM } from './account-repository-protocols'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByIdRepository } from '@/data/use-cases/balance/load-balance/db-load-balance-protocols'

export class AccountRepository implements LoadAccountByIdRepository {
  constructor (private readonly loadAccountByIdORM: LoadAccountByIdORM) {}

  async loadById (id: number): Promise<AccountModel | null> {
    return await this.loadAccountByIdORM.loadById(id)
  }
}

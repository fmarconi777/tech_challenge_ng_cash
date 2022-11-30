import { LoadAccountByIdRepository, LoadUserByIdRepository } from './db-load-balance-protocols'
import { BalanceModel, LoadBalance } from '@/domain/use-cases/balance/load-balance/load-balance'

export class DbLoadBalance implements LoadBalance {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async load (id: number): Promise<BalanceModel> {
    const user: any = await this.loadUserByIdRepository.loadById(id)
    const account: any = await this.loadAccountByIdRepository.loadById(+user.accountId)
    return { balance: account.balance }
  }
}

import { BalanceModel, LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { LoadAccountByIdRepository, CheckUserByIdRepository } from './db-load-balance-protocols'

export class DbLoadBalance implements LoadBalance {
  constructor (
    private readonly checkUserByIdRepository: CheckUserByIdRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async load (id: number): Promise<BalanceModel> {
    const user: any = await this.checkUserByIdRepository.checkById(id)
    const account: any = await this.loadAccountByIdRepository.loadById(+user.accountId)
    return { balance: account.balance }
  }
}

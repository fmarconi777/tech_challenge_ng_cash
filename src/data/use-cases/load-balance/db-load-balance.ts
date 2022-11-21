import { BalanceModel, LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { LoadAccountByIdRepository } from '../../protocols/db/accout/load-account-by-id-repository'
import { CheckUserByIdRepository } from '../../protocols/db/user/check-user-by-id-repository'

export class DbLoadBalance implements LoadBalance {
  constructor (
    private readonly checkUserByIdRepository: CheckUserByIdRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async load (id: number): Promise<BalanceModel> {
    const user: any = await this.checkUserByIdRepository.checkById(id)
    await this.loadAccountByIdRepository.checkById(+user.accountId)
    return { balance: '' }
  }
}

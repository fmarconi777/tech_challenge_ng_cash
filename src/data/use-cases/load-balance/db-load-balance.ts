import { BalanceModel, LoadBalance } from '../../../domain/use-cases/load-balance/load-balance'
import { CheckUserByIdRepository } from '../../protocols/db/user/check-user-by-id-repository'

export class DbLoadBalance implements LoadBalance {
  constructor (private readonly checkUserByIdRepository: CheckUserByIdRepository) {}

  async load (id: number): Promise<BalanceModel> {
    await this.checkUserByIdRepository.checkById(id)
    return { balance: '' }
  }
}

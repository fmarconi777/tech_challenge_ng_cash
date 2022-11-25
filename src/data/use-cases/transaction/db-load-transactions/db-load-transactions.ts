import { LoadTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-transactions'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

export class DbLoadTransactions implements LoadTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository
  ) {}

  async load (id: number): Promise<RecordsData[]> {
    await this.loadUserByIdRepository.loadById(id)
    return []
  }
}

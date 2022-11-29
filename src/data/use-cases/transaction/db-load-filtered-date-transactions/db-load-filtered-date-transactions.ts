import { LoadFilteredDateTransactions, RecordsData, TimePeriod } from '../../../../domain/use-cases/transaction/load-filtered-date-transactions/load-filtered-date-transactions'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

export class DbLoadFilteredDateTransactions implements LoadFilteredDateTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository
  ) {}

  async load (timePeriod: TimePeriod): Promise<RecordsData[]> {
    await this.loadUserByIdRepository.loadById(timePeriod.userId)
    return []
  }
}

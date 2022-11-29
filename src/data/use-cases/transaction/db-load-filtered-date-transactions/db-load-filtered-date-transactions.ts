import { LoadFilteredDateTransactions, RecordsData, TimePeriod } from '../../../../domain/use-cases/transaction/load-filtered-date-transactions/load-filtered-date-transactions'
import { LoadFilterByDateTransactionsRepository } from '../../../protocols/db/transaction/load-filter-by-date-transactions-repository'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

export class DbLoadFilteredDateTransactions implements LoadFilteredDateTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadFilterByDateTransactionsRepository: LoadFilterByDateTransactionsRepository
  ) {}

  async load (timePeriod: TimePeriod): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(timePeriod.userId)
    const periodData = {
      accountId: +user.accountId,
      startDate: timePeriod.startDate,
      endDate: timePeriod.endDate
    }
    return await this.loadFilterByDateTransactionsRepository.loadByFilterDate(periodData)
  }
}

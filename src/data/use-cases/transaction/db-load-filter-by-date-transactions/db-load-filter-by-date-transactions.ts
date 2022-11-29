import { LoadFilterByDateTransactions, RecordsData, TimePeriod, LoadFilterByDateTransactionsRepository, LoadUserByIdRepository } from './db-load-filter-by-date-transactions-protocols'

export class DbLoadFilterByDateTransactions implements LoadFilterByDateTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadFilterByDateTransactionsRepository: LoadFilterByDateTransactionsRepository
  ) {}

  async loadByDate (timePeriod: TimePeriod): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(timePeriod.userId)
    const periodData = {
      accountId: +user.accountId,
      startDate: timePeriod.startDate,
      endDate: timePeriod.endDate
    }
    return await this.loadFilterByDateTransactionsRepository.loadByFilterDate(periodData)
  }
}

import { FilterData, LoadFilteredCashTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-filtered-cash-transactions/load-filtered-cash-transactions'
import { LoadFilteredCashTransactionsRepository, LoadUserByIdRepository } from './db-load-filtered-cash-transactions-protocols'

export class DbLoadFilteredCashTransactions implements LoadFilteredCashTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadFilteredCashTransactionsRepository: LoadFilteredCashTransactionsRepository
  ) {}

  async load (filterData: FilterData): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(filterData.userId)
    const filterValues = {
      accountId: +user.accountId,
      filter: filterData.filter
    }
    return await this.loadFilteredCashTransactionsRepository.loadByFilter(filterValues)
  }
}

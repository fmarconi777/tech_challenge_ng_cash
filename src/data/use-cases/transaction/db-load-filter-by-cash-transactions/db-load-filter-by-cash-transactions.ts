import { LoadFilterByCashTransactionsRepository, LoadUserByIdRepository } from './db-load-filter-by-cash-transactions-protocols'
import { FilterData, LoadFilterByCashTransactions, RecordsData } from '@/domain/use-cases/transaction/load-filter-by-cash-transactions/load-filter-by-cash-transactions'

export class DbLoadFilterByCashTransactions implements LoadFilterByCashTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadFilterByCashTransactionsRepository: LoadFilterByCashTransactionsRepository
  ) {}

  async loadByCash (filterData: FilterData): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(filterData.userId)
    const filterValues = {
      accountId: +user.accountId,
      filter: filterData.filter
    }
    return await this.loadFilterByCashTransactionsRepository.loadByFilter(filterValues)
  }
}

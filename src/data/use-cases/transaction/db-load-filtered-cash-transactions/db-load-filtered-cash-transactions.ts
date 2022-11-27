import { FilterData, LoadFilteredCashTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-filtered-cash-transactions/load-filtered-cash-transactions'
import { LoadFilteredCashTransactionsRepository } from '../../../protocols/db/transaction/load-filtered-cash-transactions-repository'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

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

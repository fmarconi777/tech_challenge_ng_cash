import { FilterData, LoadFilteredCashTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-filtered-cash-transactions/load-filtered-cash-transactions'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

export class DbLoadFilteredCashTransactions implements LoadFilteredCashTransactions {
  constructor (
    private readonly loadUserByIdRepositoryStub: LoadUserByIdRepository
  ) {}

  async load (filterData: FilterData): Promise<RecordsData[]> {
    await this.loadUserByIdRepositoryStub.loadById(filterData.userId)
    return []
  }
}

import { LoadFilterByDateTransactionsRepository, PeriodData } from '../../../data/protocols/db/transaction/load-filter-by-date-transactions-repository'
import { FilterValues, LoadFilterByCashTransactionsRepository } from '../../../data/protocols/db/transaction/load-filtered-cash-transactions-repository'
import { LoadTransactionsByAccountIdRepository, RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-account-id-repository'
import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { LoadTransactionsByAccountIdORM, RecordTransactionORM, LoadFilterByCashTransactionsORM, LoadFilterByDateTransactionsORM } from './transaction-repository-protocols'

export class TransactionRepository implements
  RecordTransactionRepository,
  LoadTransactionsByAccountIdRepository,
  LoadFilterByCashTransactionsRepository,
  LoadFilterByDateTransactionsRepository {
  constructor (
    private readonly recordTransactionORM: RecordTransactionORM,
    private readonly loadTransactionsByAccountIdORM: LoadTransactionsByAccountIdORM,
    private readonly loadFilterByCashTransactionsORM: LoadFilterByCashTransactionsORM,
    private readonly loadFilterByDateTransactionsORM: LoadFilterByDateTransactionsORM
  ) {}

  async record (recordData: RecordData): Promise<string> {
    return await this.recordTransactionORM.record(recordData)
  }

  async loadByAccountId (id: number): Promise<RecordsData[]> {
    return await this.loadTransactionsByAccountIdORM.loadByAccountId(id)
  }

  async loadByFilter (filterValues: FilterValues): Promise<RecordsData[]> {
    return await this.loadFilterByCashTransactionsORM.loadByCashFilter(filterValues)
  }

  async loadByFilterDate (periodData: PeriodData): Promise<RecordsData[]> {
    return await this.loadFilterByDateTransactionsORM.loadByFilterDate(periodData)
  }
}

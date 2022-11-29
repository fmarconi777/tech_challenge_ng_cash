import { LoadFilterByDateTransactionsRepository, PeriodData } from '../../../data/protocols/db/transaction/load-filter-by-date-transactions-repository'
import { FilterValues, LoadFilteredCashTransactionsRepository } from '../../../data/protocols/db/transaction/load-filtered-cash-transactions-repository'
import { LoadTransactionsByAccountIdRepository, RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-account-id-repository'
import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { LoadFilterByDateTransactionsORM } from '../../protocols/transaction/load-filter-by-date-transactions-orm'
import { LoadTransactionsByAccountIdORM, RecordTransactionORM, LoadFilteredCashTransactionsORM } from './transaction-repository-protocols'

export class TransactionRepository implements
  RecordTransactionRepository,
  LoadTransactionsByAccountIdRepository,
  LoadFilteredCashTransactionsRepository,
  LoadFilterByDateTransactionsRepository {
  constructor (
    private readonly recordTransactionORM: RecordTransactionORM,
    private readonly loadTransactionsByAccountIdORM: LoadTransactionsByAccountIdORM,
    private readonly loadFilteredCashTransactionsORM: LoadFilteredCashTransactionsORM,
    private readonly loadFilterByDateTransactionsORM: LoadFilterByDateTransactionsORM
  ) {}

  async record (recordData: RecordData): Promise<string> {
    return await this.recordTransactionORM.record(recordData)
  }

  async loadByAccountId (id: number): Promise<RecordsData[]> {
    return await this.loadTransactionsByAccountIdORM.loadByAccountId(id)
  }

  async loadByFilter (filterValues: FilterValues): Promise<RecordsData[]> {
    return await this.loadFilteredCashTransactionsORM.loadByFilter(filterValues)
  }

  async loadByFilterDate (periodData: PeriodData): Promise<RecordsData[]> {
    return await this.loadFilterByDateTransactionsORM.loadByFilterDate(periodData)
  }
}

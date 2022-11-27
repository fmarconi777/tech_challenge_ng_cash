import { FilterValues, LoadFilteredCashTransactionsRepository } from '../../../data/protocols/db/transaction/load-filtered-cash-transactions-repository'
import { LoadTransactionsByAccountIdRepository, RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-account-id-repository'
import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { LoadTransactionsByAccountIdORM, RecordTransactionORM, LoadFilteredCashTransactionsORM } from './transaction-repository-protocols'

export class TransactionRepository implements
  RecordTransactionRepository,
  LoadTransactionsByAccountIdRepository,
  LoadFilteredCashTransactionsRepository {
  constructor (
    private readonly recordTransactionORM: RecordTransactionORM,
    private readonly loadTransactionsByAccountIdORM: LoadTransactionsByAccountIdORM,
    private readonly loadFilteredCashTransactionsORMStub: LoadFilteredCashTransactionsORM
  ) {}

  async record (recordData: RecordData): Promise<string> {
    return await this.recordTransactionORM.record(recordData)
  }

  async loadByAccountId (id: number): Promise<RecordsData[]> {
    return await this.loadTransactionsByAccountIdORM.loadByAccountId(id)
  }

  async loadByFilter (filterValues: FilterValues): Promise<RecordsData[]> {
    await this.loadFilteredCashTransactionsORMStub.loadByFilter(filterValues)
    return []
  }
}

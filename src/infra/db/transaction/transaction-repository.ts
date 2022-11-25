import { LoadTransactionsByAccountIdRepository, RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-account-id-repository'
import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { LoadTransactionsByAccountIdORM } from '../../protocols/transaction/load-transactions-by-account-id-orm'
import { RecordTransactionORM } from '../../protocols/transaction/record-transaction-orm'

export class TransactionRepository implements RecordTransactionRepository, LoadTransactionsByAccountIdRepository {
  constructor (
    private readonly recordTransactionORM: RecordTransactionORM,
    private readonly loadTransactionsByAccountIdORM: LoadTransactionsByAccountIdORM
  ) {}

  async record (recordData: RecordData): Promise<string> {
    return await this.recordTransactionORM.record(recordData)
  }

  async loadByAccountId (id: number): Promise<RecordsData[]> {
    return await this.loadTransactionsByAccountIdORM.loadByAccountId(id)
  }
}

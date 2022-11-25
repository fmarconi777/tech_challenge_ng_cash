import { LoadTransactionsByIdRepository, RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-id-repository'
import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { LoadTransactionsByIdORM } from '../../protocols/transaction/load-transactions-orm'
import { RecordTransactionORM } from '../../protocols/transaction/record-transaction-orm'

export class TransactionRepository implements RecordTransactionRepository, LoadTransactionsByIdRepository {
  constructor (
    private readonly recordTransactionORM: RecordTransactionORM,
    private readonly loadTransactionsByIdORM: LoadTransactionsByIdORM
  ) {}

  async record (recordData: RecordData): Promise<string> {
    return await this.recordTransactionORM.record(recordData)
  }

  async loadById (id: number): Promise<RecordsData[]> {
    return await this.loadTransactionsByIdORM.loadById(id)
  }
}

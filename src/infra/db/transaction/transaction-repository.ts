import { RecordData, RecordTransactionRepository } from '../../../data/protocols/db/transaction/record-transaction-repository'
import { RecordTransactionORM } from '../../protocols/transaction/record-transaction-orm'

export class TransactionRepository implements RecordTransactionRepository {
  constructor (private readonly recordTransactionORM: RecordTransactionORM) {}

  async record (recordData: RecordData): Promise<string> {
    await this.recordTransactionORM.record(recordData)
    return ''
  }
}

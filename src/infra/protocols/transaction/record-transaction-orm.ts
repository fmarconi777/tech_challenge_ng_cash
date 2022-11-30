import { RecordData } from '@/data/protocols/db/transaction/record-transaction-repository'

export { RecordData }

export interface RecordTransactionORM {
  record: (recordData: RecordData) => Promise<string>
}

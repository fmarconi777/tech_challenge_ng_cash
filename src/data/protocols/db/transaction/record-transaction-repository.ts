export type RecordData = {
  debitedAccountId: number
  debitBalance: number
  creditedAccountId: number
  creditBalance: number
  value: number
}

export interface RecordTransactionRepository {
  record: (recordData: RecordData) => Promise<string>
}

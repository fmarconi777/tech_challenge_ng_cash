export type RecordData = {
  debitedAccountId: number
  debitedBalance: number
  creditedAccountId: number
  creditedBalance: number
  value: number
}

export interface RecordTransactionRepository {
  record: (recordData: RecordData) => Promise<string>
}

export type TransactionData = {
  cashOutUsername: string
  cashInUsername: string
  credit: number
}

export interface RecordTransaction {
  record: (transactionData: TransactionData) => Promise<string>
}

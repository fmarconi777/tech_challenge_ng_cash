export type TransactionData = {
  cashOutUsername: string
  cashInUsername: string
  credit: string
}

export type Record = {
  recorded: boolean
  message: string
}

export interface RecordTransaction {
  record: (transactionData: TransactionData) => Promise<Record>
}

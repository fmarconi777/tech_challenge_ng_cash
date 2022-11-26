export type TransactionData = {
  debitedUsername: string
  creditedUsername: string
  value: string
}

export type Record = {
  recorded: boolean
  message: string
}

export interface RecordTransaction {
  record: (transactionData: TransactionData) => Promise<Record>
}

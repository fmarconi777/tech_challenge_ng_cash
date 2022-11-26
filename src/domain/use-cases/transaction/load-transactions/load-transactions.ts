export type RecordsData = {
  id: string
  debitedUsername: string
  creditedUsername: string
  value: string
  createdAt: string
}

export interface LoadTransactions {
  load: (id: number) => Promise<RecordsData[]>
}

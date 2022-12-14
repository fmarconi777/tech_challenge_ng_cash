import { RecordsData } from '../load-transactions/load-transactions'

export { RecordsData }

export type TimePeriod = {
  userId: number
  startDate: string
  endDate: string
}

export interface LoadFilterByDateTransactions {
  loadByDate: (timePeriod: TimePeriod) => Promise<RecordsData[]>
}

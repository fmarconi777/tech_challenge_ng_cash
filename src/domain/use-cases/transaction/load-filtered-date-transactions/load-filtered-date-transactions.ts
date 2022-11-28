import { RecordsData } from '../load-transactions/load-transactions'

export { RecordsData }

export type TimePeriod = {
  startDate: string
  endDate: string
}

export interface LoadFilteredDateTransactions {
  load: (timePeriod: TimePeriod) => Promise<RecordsData[]>
}

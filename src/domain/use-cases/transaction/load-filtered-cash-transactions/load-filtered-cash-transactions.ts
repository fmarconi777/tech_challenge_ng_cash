import { RecordsData } from '../load-transactions/load-transactions'

export { RecordsData }

export type FilterData = {
  userId: number
  filter: string
}

export interface LoadFilteredCashTransactions {
  load: (filterData: FilterData) => Promise<RecordsData[]>
}

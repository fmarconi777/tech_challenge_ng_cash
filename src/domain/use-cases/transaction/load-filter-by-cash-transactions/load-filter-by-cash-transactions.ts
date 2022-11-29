import { RecordsData } from '../load-transactions/load-transactions'

export { RecordsData }

export type FilterData = {
  userId: number
  filter: string
}

export interface LoadFilterByCashTransactions {
  loadByCash: (filterData: FilterData) => Promise<RecordsData[]>
}

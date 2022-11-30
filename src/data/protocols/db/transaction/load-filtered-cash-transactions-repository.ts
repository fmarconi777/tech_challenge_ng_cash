import { RecordsData } from '@/domain/use-cases/transaction/load-transactions/load-transactions'

export { RecordsData }

export type FilterValues = {
  accountId: number
  filter: string
}

export interface LoadFilterByCashTransactionsRepository {
  loadByFilter: (filterValues: FilterValues) => Promise<RecordsData[]>
}

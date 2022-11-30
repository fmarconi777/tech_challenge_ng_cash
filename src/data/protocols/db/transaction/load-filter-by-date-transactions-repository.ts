import { RecordsData } from '@/domain/use-cases/transaction/load-transactions/load-transactions'

export { RecordsData }

export type PeriodData = {
  accountId: number
  startDate: string
  endDate: string
}

export interface LoadFilterByDateTransactionsRepository {
  loadByFilterDate: (periodData: PeriodData) => Promise<RecordsData[]>
}

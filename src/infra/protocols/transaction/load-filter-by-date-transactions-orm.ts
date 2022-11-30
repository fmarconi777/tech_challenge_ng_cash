import { PeriodData } from '@/data/protocols/db/transaction/load-filter-by-date-transactions-repository'
import { RecordsData } from '@/domain/use-cases/transaction/load-transactions/load-transactions'

export interface LoadFilterByDateTransactionsORM {
  loadByFilterDate: (periodData: PeriodData) => Promise<RecordsData[]>
}

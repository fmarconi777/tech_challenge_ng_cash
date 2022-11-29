import { FilterValues, RecordsData } from '../../../data/protocols/db/transaction/load-filtered-cash-transactions-repository'

export { FilterValues, RecordsData }

export interface LoadFilterByCashTransactionsORM {
  loadByCashFilter: (filterValues: FilterValues) => Promise<RecordsData[]>
}

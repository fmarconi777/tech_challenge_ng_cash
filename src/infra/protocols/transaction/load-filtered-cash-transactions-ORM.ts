import { FilterValues, RecordsData } from '../../../data/protocols/db/transaction/load-filtered-cash-transactions-repository'

export { FilterValues, RecordsData }

export interface LoadFilteredCashTransactionsORM {
  loadByFilter: (filterValues: FilterValues) => Promise<RecordsData[]>
}

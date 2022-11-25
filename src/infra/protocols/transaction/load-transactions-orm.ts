import { RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-id-repository'

export { RecordsData }

export interface LoadTransactionsByIdORM {
  loadById: (id: number) => Promise<RecordsData[]>
}

import { RecordsData } from '../../../data/protocols/db/transaction/load-transactions-by-account-id-repository'

export { RecordsData }

export interface LoadTransactionsByAccountIdORM {
  loadByAccountId: (id: number) => Promise<RecordsData[]>
}

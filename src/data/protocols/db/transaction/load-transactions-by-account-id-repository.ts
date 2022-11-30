import { RecordsData } from '@/domain/use-cases/transaction/load-transactions/load-transactions'

export { RecordsData }

export interface LoadTransactionsByAccountIdRepository {
  loadByAccountId: (id: number) => Promise<RecordsData[]>
}

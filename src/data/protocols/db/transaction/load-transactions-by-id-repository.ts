import { RecordsData } from '../../../../domain/use-cases/transaction/load-transactions'

export { RecordsData }

export interface LoadTransactionsByIdRepository {
  loadById: (id: number) => Promise<RecordsData[]>
}

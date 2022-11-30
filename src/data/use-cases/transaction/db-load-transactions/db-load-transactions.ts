import { LoadTransactionsByAccountIdRepository, LoadUserByIdRepository } from './db-load-trasactions-protocols'
import { LoadTransactions, RecordsData } from '@/domain/use-cases/transaction/load-transactions/load-transactions'

export class DbLoadTransactions implements LoadTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadTransactionsByAccountIdRepository: LoadTransactionsByAccountIdRepository
  ) {}

  async load (id: number): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(id)
    return await this.loadTransactionsByAccountIdRepository.loadByAccountId(+user.accountId)
  }
}

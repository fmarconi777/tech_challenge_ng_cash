import { LoadTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-transactions'
import { LoadTransactionsByIdRepository, LoadUserByIdRepository } from './db-load-trasactions-protocols'

export class DbLoadTransactions implements LoadTransactions {
  constructor (
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
    private readonly loadTransactionsByIdRepositoryStub: LoadTransactionsByIdRepository
  ) {}

  async load (id: number): Promise<RecordsData[]> {
    const user: any = await this.loadUserByIdRepository.loadById(id)
    return await this.loadTransactionsByIdRepositoryStub.loadById(+user.accountId)
  }
}

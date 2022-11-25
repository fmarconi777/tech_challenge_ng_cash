import { LoadTransactions, RecordsData } from '../../../../domain/use-cases/transaction/load-transactions'
import { LoadTransactionsByIdRepository } from '../../../protocols/db/transaction/load-transactions-by-id-repository'
import { LoadUserByIdRepository } from '../../../protocols/db/user/load-user-by-id-repository'

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

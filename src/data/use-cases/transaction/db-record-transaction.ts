import { Record, RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbRecordTransaction implements RecordTransaction {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository
  ) {}

  async record (transactionData: TransactionData): Promise<Record> {
    await this.loadUserByUsernameRepository.loadByUsername(transactionData.cashInUsername)
    return {
      recorded: false,
      message: ''
    }
  }
}

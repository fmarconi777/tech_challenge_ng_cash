import { Record, RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbRecordTransaction implements RecordTransaction {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async record (transactionData: TransactionData): Promise<Record> {
    const cashInUser = await this.loadUserByUsernameRepository.loadByUsername(transactionData.cashInUsername)
    if (cashInUser) {
      const cashOutUser: any = await this.loadUserByUsernameRepository.loadByUsername(transactionData.cashOutUsername)
      await this.loadAccountByIdRepository.loadById(+cashOutUser.accountId)
      return {
        recorded: true,
        message: ''
      }
    }
    return {
      recorded: false,
      message: 'Invalid cashInUsername'
    }
  }
}

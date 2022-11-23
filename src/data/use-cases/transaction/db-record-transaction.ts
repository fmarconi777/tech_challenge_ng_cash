import { Record, RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbRecordTransaction implements RecordTransaction {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async record (transactionData: TransactionData): Promise<Record> {
    const { cashInUsername, cashOutUsername, credit } = transactionData
    const cashInUser = await this.loadUserByUsernameRepository.loadByUsername(cashInUsername)
    if (cashInUser) {
      const cashOutUser: any = await this.loadUserByUsernameRepository.loadByUsername(cashOutUsername)
      const cashOutAccount: any = await this.loadAccountByIdRepository.loadById(+cashOutUser.accountId)
      const resultBalance = Number.parseFloat(cashOutAccount?.balance) - Number.parseFloat(credit)
      if (resultBalance >= 0) {
        return {
          recorded: true,
          message: ''
        }
      }
      return {
        recorded: false,
        message: 'Insufficient balance'
      }
    }
    return {
      recorded: false,
      message: 'Invalid cashInUsername'
    }
  }
}

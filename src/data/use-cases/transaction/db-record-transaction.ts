import { Record, RecordTransaction, TransactionData } from '../../../domain/use-cases/transaction/record-transaction'
import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { RecordTransactionRepository } from '../../protocols/db/transaction/record-transaction-repository'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbRecordTransaction implements RecordTransaction {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly recordTransactionRepository: RecordTransactionRepository
  ) {}

  async record (transactionData: TransactionData): Promise<Record> {
    const { creditedUsername, debitedUsername, value } = transactionData
    const creditedUser = await this.loadUserByUsernameRepository.loadByUsername(creditedUsername)
    if (creditedUser) {
      const debitedUser: any = await this.loadUserByUsernameRepository.loadByUsername(debitedUsername)
      const debitedAccount: any = await this.loadAccountByIdRepository.loadById(+debitedUser.accountId)
      const debitBalance = Number.parseFloat(debitedAccount?.balance) - Number.parseFloat(value)
      if (debitBalance >= 0) {
        const creditedAccount: any = await this.loadAccountByIdRepository.loadById(+creditedUser.accountId)
        const creditBalance = Number.parseFloat(creditedAccount.balance) + Number.parseFloat(value)
        const recordData = {
          debitedAccountId: +debitedUser.accountId,
          debitBalance,
          creditedAccountId: +creditedUser.accountId,
          creditBalance,
          value: +value
        }
        await this.recordTransactionRepository.record(recordData)
      }
      return {
        recorded: false,
        message: 'Insufficient balance'
      }
    }
    return {
      recorded: false,
      message: 'Invalid creditedUsername'
    }
  }
}

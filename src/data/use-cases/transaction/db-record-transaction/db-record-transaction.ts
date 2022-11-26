import { Record, RecordTransaction, TransactionData } from '../../../../domain/use-cases/transaction/record-transaction/record-transaction'
import { LoadAccountByIdRepository, RecordTransactionRepository, LoadUserByUsernameRepository } from './db-record-transaction-protocols'

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
      const debitedBalance = Number.parseFloat(debitedAccount?.balance) - Number.parseFloat(value)
      if (debitedBalance >= 0) {
        const creditedAccount: any = await this.loadAccountByIdRepository.loadById(+creditedUser.accountId)
        const creditedBalance = Number.parseFloat(creditedAccount.balance) + Number.parseFloat(value)
        const recordData = {
          debitedAccountId: +debitedUser.accountId,
          debitedBalance,
          creditedAccountId: +creditedUser.accountId,
          creditedBalance,
          value: +value
        }
        const record = await this.recordTransactionRepository.record(recordData)
        return {
          recorded: true,
          message: record
        }
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

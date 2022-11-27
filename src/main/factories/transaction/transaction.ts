import { DbLoadTransactions } from '../../../data/use-cases/transaction/db-load-transactions/db-load-transactions'
import { DbRecordTransaction } from '../../../data/use-cases/transaction/db-record-transaction/db-record-transaction'
import { AccountRepository } from '../../../infra/db/account/account-repository'
import { TransactionRepository } from '../../../infra/db/transaction/transaction-repository'
import { UserRepository } from '../../../infra/db/user/user-repository'
import { SequelizeAccountAdapter } from '../../../infra/sequelize/sequelize-adapters/account/sequelize-account-adapter'
import { SequelizeTransactionAdapter } from '../../../infra/sequelize/sequelize-adapters/transaction/sequelize-transaction-adapter'
import { SequelizeUserAdapter } from '../../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { TransactionController } from '../../../presentation/controllers/transaction/transaction'
import { Controller } from '../../../presentation/protocols'
import { CurrencyValidatorAdapter } from '../../../util/validators/currency-validator-adapter'

export const makeTransactionController = (): Controller => {
  const transactionORM = new SequelizeTransactionAdapter()
  const transactionRepository = new TransactionRepository(transactionORM, transactionORM, transactionORM)
  const accountORM = new SequelizeAccountAdapter()
  const accountRepository = new AccountRepository(accountORM)
  const userORM = new SequelizeUserAdapter()
  const userRepository = new UserRepository(userORM, userORM)
  const loadTransactions = new DbLoadTransactions(userRepository, transactionRepository)
  const recordTransaction = new DbRecordTransaction(userRepository, accountRepository, transactionRepository)
  const currencyValidator = new CurrencyValidatorAdapter()
  return new TransactionController(currencyValidator, recordTransaction, loadTransactions)
}

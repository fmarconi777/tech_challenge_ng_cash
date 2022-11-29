import { DbLoadFilteredCashTransactions } from '../../../data/use-cases/transaction/db-load-filtered-cash-transactions/db-load-filtered-cash-transactions'
import { DbLoadFilteredDateTransactions } from '../../../data/use-cases/transaction/db-load-filtered-date-transactions/db-load-filtered-date-transactions'
import { TransactionRepository } from '../../../infra/db/transaction/transaction-repository'
import { UserRepository } from '../../../infra/db/user/user-repository'
import { SequelizeTransactionAdapter } from '../../../infra/sequelize/sequelize-adapters/transaction/sequelize-transaction-adapter'
import { SequelizeUserAdapter } from '../../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { TransactionFilterController } from '../../../presentation/controllers/transaction/transaction-filter'
import { Controller } from '../../../presentation/protocols'
import { DateValidatorAdapter } from '../../../util/validators/date-validator-adapter'

export const makeTransactionFilterController = (): Controller => {
  const transactionORM = new SequelizeTransactionAdapter()
  const userORM = new SequelizeUserAdapter()
  const transactionRepository = new TransactionRepository(transactionORM, transactionORM, transactionORM, transactionORM)
  const userRepository = new UserRepository(userORM, userORM)
  const loadFilteredDateTransactions = new DbLoadFilteredDateTransactions(userRepository, transactionRepository)
  const dateValidator = new DateValidatorAdapter()
  const loadFilteredCashTransactions = new DbLoadFilteredCashTransactions(userRepository, transactionRepository)
  return new TransactionFilterController(loadFilteredCashTransactions, dateValidator, loadFilteredDateTransactions)
}

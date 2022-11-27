import { DbLoadFilteredCashTransactions } from '../../../data/use-cases/transaction/db-load-filtered-cash-transactions/db-load-filtered-cash-transactions'
import { TransactionRepository } from '../../../infra/db/transaction/transaction-repository'
import { UserRepository } from '../../../infra/db/user/user-repository'
import { SequelizeTransactionAdapter } from '../../../infra/sequelize/sequelize-adapters/transaction/sequelize-transaction-adapter'
import { SequelizeUserAdapter } from '../../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { TransactionFilterController } from '../../../presentation/controllers/transaction/transaction-filter'
import { Controller } from '../../../presentation/protocols'

export const makeTransactionFilterController = (): Controller => {
  const transactionORM = new SequelizeTransactionAdapter()
  const userORM = new SequelizeUserAdapter()
  const transactionRepository = new TransactionRepository(transactionORM, transactionORM, transactionORM)
  const userRepository = new UserRepository(userORM, userORM)
  const loadFilteredCashTransactions = new DbLoadFilteredCashTransactions(userRepository, transactionRepository)
  return new TransactionFilterController(loadFilteredCashTransactions)
}

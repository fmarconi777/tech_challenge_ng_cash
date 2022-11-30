import { Controller } from '@/presentation/protocols'
import { TransactionFilterController } from '@/presentation/controllers/transaction/transaction-filter'
import { DbLoadFilterByCashTransactions } from '@/data/use-cases/transaction/db-load-filter-by-cash-transactions/db-load-filter-by-cash-transactions'
import { DbLoadFilterByDateTransactions } from '@/data/use-cases/transaction/db-load-filter-by-date-transactions/db-load-filter-by-date-transactions'
import { DateValidatorAdapter } from '@/util/validators/date-validator-adapter'
import { TransactionRepository } from '@/infra/db/transaction/transaction-repository'
import { UserRepository } from '@/infra/db/user/user-repository'
import { SequelizeTransactionAdapter } from '@/infra/sequelize/sequelize-adapters/transaction/sequelize-transaction-adapter'
import { SequelizeUserAdapter } from '@/infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'

export const makeTransactionFilterController = (): Controller => {
  const transactionORM = new SequelizeTransactionAdapter()
  const userORM = new SequelizeUserAdapter()
  const transactionRepository = new TransactionRepository(transactionORM, transactionORM, transactionORM, transactionORM)
  const userRepository = new UserRepository(userORM, userORM)
  const loadFilterByDateTransactions = new DbLoadFilterByDateTransactions(userRepository, transactionRepository)
  const dateValidator = new DateValidatorAdapter()
  const loadFilterByCashTransactions = new DbLoadFilterByCashTransactions(userRepository, transactionRepository)
  return new TransactionFilterController(loadFilterByCashTransactions, dateValidator, loadFilterByDateTransactions)
}

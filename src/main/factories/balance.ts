import { DbLoadBalance } from '../../data/use-cases/load-balance/db-load-balance'
import { AccountRepository } from '../../infra/db/account/account-repository'
import { UserRepository } from '../../infra/db/user/user-repository'
import { SequelizeAccountAdapter } from '../../infra/sequelize/sequelize-adapters/account/sequelize-account-adapter'
import { SequelizeUserAdapter } from '../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { BalanceController } from '../../presentation/controllers/balance/balance'
import { Controller } from '../../presentation/protocols'

export const makeBalanceController = (): Controller => {
  const accountORM = new SequelizeAccountAdapter()
  const accountRepository = new AccountRepository(accountORM)
  const userORM = new SequelizeUserAdapter()
  const userRepository = new UserRepository(userORM, userORM)
  const loadBalance = new DbLoadBalance(userRepository, accountRepository)
  return new BalanceController(loadBalance)
}

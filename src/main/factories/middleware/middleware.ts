import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { Middleware } from '@/presentation/protocols'
import { DbLoadUserByToken } from '@/data/use-cases/middlewares/load-user-by-token/db-load-user-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { UserRepository } from '@/infra/db/user/user-repository'
import { SequelizeUserAdapter } from '@/infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'

export const makeAuthMiddleware = (): Middleware => {
  const userNameORM = new SequelizeUserAdapter()
  const userRepository = new UserRepository(userNameORM, userNameORM)
  const decrypter = new JwtAdapter()
  const loadUserByToken = new DbLoadUserByToken(decrypter, userRepository)
  return new AuthMiddleware(loadUserByToken)
}

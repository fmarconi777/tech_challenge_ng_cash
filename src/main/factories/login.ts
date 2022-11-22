import { DbAuthentication } from '../../data/use-cases/authentication/db-authentication'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter/jwt-adapter'
import { UserRepository } from '../../infra/db/user/user-repository'
import { SequelizeUserAdapter } from '../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { LoginController } from '../../presentation/controllers/login/login'
import { Controller } from '../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const userORM = new SequelizeUserAdapter()
  const encrypter = new JwtAdapter()
  const hashComparer = new BcryptAdapter()
  const userRepository = new UserRepository(userORM, userORM)
  const authentication = new DbAuthentication(userRepository, hashComparer, encrypter)
  return new LoginController(authentication)
}

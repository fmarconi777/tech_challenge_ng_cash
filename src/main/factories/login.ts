import { DbAuthentication } from '../../data/use-cases/authentication/db-authentication'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../infra/cryptography/jwt-adapter/jwt-adapter'
import { UserRepository } from '../../infra/db/user/user-repository'
import { SequelizeUserAdapter } from '../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { LoginController } from '../../presentation/controllers/login/login'
import { Controller } from '../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const checkUserByUserNameORM = new SequelizeUserAdapter()
  const encrypter = new JwtAdapter()
  const hashComparer = new BcryptAdapter()
  const checkUserByUsernameRepository = new UserRepository(checkUserByUserNameORM)
  const authentication = new DbAuthentication(checkUserByUsernameRepository, hashComparer, encrypter)
  return new LoginController(authentication)
}

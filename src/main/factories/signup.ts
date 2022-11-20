import { DbAddUserAccount } from '../../data/use-cases/add-user-account/db-add-user-accout'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { UserAccountRepository } from '../../infra/db/user-account/user-account-repository'
import { UserRepository } from '../../infra/db/user-account/user-repository'
import { SequelizeUserAccountAdapter } from '../../infra/sequelize/sequelize-adapters/user-account/sequelize-user-account-adapter'
import { SequelizeUserAdapter } from '../../infra/sequelize/sequelize-adapters/user-account/sequelize-user-adapter'
import { SignUpController } from '../../presentation/controllers/singup/singup'
import { Controller } from '../../presentation/protocols'
import { PasswordValidatorAdapter } from '../../util/validators/password-validator-adapter'
import { UserValidatorAdapter } from '../../util/validators/user-validator-adapter'

export const makeSignupControler = (): Controller => {
  const checkUserByUserNameORM = new SequelizeUserAdapter()
  const checkUserByUsernameRepository = new UserRepository(checkUserByUserNameORM)
  const addUserAccountORM = new SequelizeUserAccountAdapter()
  const addUserAccountRepository = new UserAccountRepository(addUserAccountORM)
  const hasher = new BcryptAdapter()
  const addUserAccount = new DbAddUserAccount(hasher, addUserAccountRepository, checkUserByUsernameRepository)
  const passwordValidator = new PasswordValidatorAdapter()
  const userValidator = new UserValidatorAdapter()
  return new SignUpController(userValidator, passwordValidator, addUserAccount)
}

import { DbAddUserAccount } from '../../data/use-cases/signup/add-user-account/db-add-user-accout'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { UserAccountRepository } from '../../infra/db/user-account/user-account-repository'
import { UserRepository } from '../../infra/db/user/user-repository'
import { SequelizeUserAccountAdapter } from '../../infra/sequelize/sequelize-adapters/user-account/sequelize-user-account-adapter'
import { SequelizeUserAdapter } from '../../infra/sequelize/sequelize-adapters/user/sequelize-user-adapter'
import { SignUpController } from '../../presentation/controllers/singup/singup'
import { Controller } from '../../presentation/protocols'
import { PasswordValidatorAdapter } from '../../util/validators/password-validator-adapter'
import { UserValidatorAdapter } from '../../util/validators/user-validator-adapter'

export const makeSignupController = (): Controller => {
  const userORM = new SequelizeUserAdapter()
  const userRepository = new UserRepository(userORM, userORM)
  const addUserAccountORM = new SequelizeUserAccountAdapter()
  const addUserAccountRepository = new UserAccountRepository(addUserAccountORM)
  const hasher = new BcryptAdapter()
  const addUserAccount = new DbAddUserAccount(hasher, addUserAccountRepository, userRepository)
  const passwordValidator = new PasswordValidatorAdapter()
  const userValidator = new UserValidatorAdapter()
  return new SignUpController(userValidator, passwordValidator, addUserAccount)
}

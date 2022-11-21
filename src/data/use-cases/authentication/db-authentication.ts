import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication/authentication'
import { HashComparer, Encrypter, CheckUserByUsernameRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly checkUserByUsernameRepository: CheckUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
    const user = await this.checkUserByUsernameRepository.checkByUsername(authenticationParams.username)
    if (user) {
      const match = await this.hashComparer.compare(authenticationParams.password, user.password)
      if (match) {
        return await this.encrypter.encrypt(user.id)
      }
    }
    return null
  }
}

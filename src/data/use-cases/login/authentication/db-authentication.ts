import { HashComparer, Encrypter, LoadUserByUsernameRepository } from './db-authentication-protocols'
import { Authentication, AuthenticationModel } from '@/domain/use-cases/login/authentication/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
    const user = await this.loadUserByUsernameRepository.loadByUsername(authenticationParams.username)
    if (user) {
      const match = await this.hashComparer.compare(authenticationParams.password, user.password)
      if (match) {
        return await this.encrypter.encrypt(user.id)
      }
    }
    return null
  }
}

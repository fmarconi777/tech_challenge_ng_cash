import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
    const user = await this.loadUserByUsernameRepository.load(authenticationParams.username)
    if (user) {
      return ''
    }
    return null
  }
}

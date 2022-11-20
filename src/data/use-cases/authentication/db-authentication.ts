import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { HashComparer } from '../../protocols/crytography/hash-comparer'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
    const user = await this.loadUserByUsernameRepository.load(authenticationParams.username)
    if (user) {
      await this.hashComparer.compare(authenticationParams.password, user.password)
      return ''
    }
    return null
  }
}

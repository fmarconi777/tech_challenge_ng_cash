import { Authentication, AuthenticationModel } from '../../../domain/use-cases/authentication'
import { HashComparer } from '../../protocols/crytography/hash-comparer'
import { TokenGenerator } from '../../protocols/crytography/token-generator'
import { LoadUserByUsernameRepository } from '../../protocols/db/user/load-user-by-username-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authenticationParams: AuthenticationModel): Promise<string | null> {
    const user = await this.loadUserByUsernameRepository.load(authenticationParams.username)
    if (user) {
      const match = await this.hashComparer.compare(authenticationParams.password, user.password)
      if (match) {
        return await this.tokenGenerator.generate(user.id)
      }
    }
    return null
  }
}

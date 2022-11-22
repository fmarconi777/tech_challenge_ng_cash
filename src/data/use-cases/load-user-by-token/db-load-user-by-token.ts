import { UserModel } from '../../../domain/models/user'
import { LoadUserByToken } from '../../../domain/use-cases/load-user-by-token/load-user-by-token'
import { Decrypter, LoadUserByIdRepository } from './db-load-user-by-token-protocols'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByIdRepository: LoadUserByIdRepository
  ) {
  }

  async load (accessToken: string): Promise<UserModel | null> {
    const payload: any = await this.decrypter.decrypt(accessToken)
    if (payload) {
      const user = await this.loadUserByIdRepository.loadById(payload.id)
      if (user) {
        return user
      }
    }
    return null
  }
}

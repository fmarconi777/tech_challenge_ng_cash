import { UserModel } from '../../../domain/models/user'
import { LoadUserByToken } from '../../../domain/use-cases/load-user-by-token/load-user-by-token'
import { Decrypter } from '../../protocols/crytography/decrypter'
import { LoadUserByIdRepository } from '../../protocols/db/user/load-user-by-id-repository'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByIdRepository: LoadUserByIdRepository
  ) {
  }

  async load (accessToken: string): Promise<UserModel | null> {
    const payload: any = await this.decrypter.decrypt(accessToken)
    if (payload) {
      await this.loadUserByIdRepository.loadById(payload.id)
    }
    return null
  }
}

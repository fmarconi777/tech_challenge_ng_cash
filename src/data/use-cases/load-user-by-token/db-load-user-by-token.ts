import { UserModel } from '../../../domain/models/user'
import { LoadUserByToken } from '../../../domain/use-cases/load-user-by-token/load-user-by-token'
import { Decrypter } from '../../protocols/crytography/decrypter'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor (private readonly decrypter: Decrypter) {
  }

  async load (accessToken: string, role?: string | undefined): Promise<UserModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}

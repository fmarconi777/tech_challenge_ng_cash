import { UserModel } from '../../../../domain/models/user'

export interface CheckUserByIdRepository {
  checkById: (id: number) => Promise<UserModel | null>
}

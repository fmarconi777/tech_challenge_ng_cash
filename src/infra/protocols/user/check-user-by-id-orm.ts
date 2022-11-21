import { UserModel } from '../../../domain/models/user'

export interface CheckUserByIdORM {
  checkById: (id: number) => Promise<UserModel | null>
}

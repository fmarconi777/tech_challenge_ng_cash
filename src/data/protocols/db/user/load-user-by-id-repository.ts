import { UserModel } from '@/domain/models/user'

export interface LoadUserByIdRepository {
  loadById: (id: number) => Promise<UserModel | null>
}

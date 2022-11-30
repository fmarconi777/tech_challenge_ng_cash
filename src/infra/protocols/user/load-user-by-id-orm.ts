import { UserModel } from '@/domain/models/user'

export interface LoadUserByIdORM {
  loadById: (id: number) => Promise<UserModel | null>
}

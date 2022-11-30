import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByIdORM {
  loadById: (id: number) => Promise<AccountModel | null>
}

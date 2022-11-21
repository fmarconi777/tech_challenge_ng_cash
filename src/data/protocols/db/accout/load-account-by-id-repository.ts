import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByIdRepository {
  checkById: (id: number) => Promise<AccountModel | null>
}

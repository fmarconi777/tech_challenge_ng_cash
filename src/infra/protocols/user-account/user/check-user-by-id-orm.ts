import { AccountModel } from '../../../../domain/models/account'

export interface CheckUserByIdORM {
  checkById: (id: number) => Promise<AccountModel | null>
}

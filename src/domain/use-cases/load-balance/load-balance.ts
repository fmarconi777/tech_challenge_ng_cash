import { AccountModel } from '../../models/account'

export interface LoadBalance {
  load: (id: number) => Promise<AccountModel>
}

import { UserData } from '../../../use-cases/signup/add-user-account/db-add-user-account-protocols'

export interface AddUserAccountRepository {
  addUserAccount: (userData: UserData) => Promise<string>
}

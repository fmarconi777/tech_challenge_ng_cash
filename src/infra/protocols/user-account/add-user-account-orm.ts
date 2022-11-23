import { UserData } from '../../../domain/use-cases/signup/add-user-account/add-user-account'

export interface AddUserAccountORM {
  addUserAccount: (userData: UserData) => Promise<string>
}

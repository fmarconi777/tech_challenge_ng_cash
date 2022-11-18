import { UserData } from '../../domain/use-cases/add-user-account'

export interface AddUserAccountORM {
  addUserAccount: (userData: UserData) => Promise<string>
}

import { UserModel } from '@/domain/models/user'

export type AuthenticationParams = Omit<UserModel, 'id' | 'accountId'>

export interface Authentication {
  auth: (authenticationParams: AuthenticationParams) => Promise<string | null>
}

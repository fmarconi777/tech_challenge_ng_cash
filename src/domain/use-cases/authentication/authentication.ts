export type AuthenticationModel = {
  username: string
  password: string
}

export interface Authentication {
  auth: (authenticationParams: AuthenticationModel) => Promise<string | null>
}

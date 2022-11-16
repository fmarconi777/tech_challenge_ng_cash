export type UserData = {
  username: string
  password: string
}

export interface AddUserAccount {
  addUserAccount: (userData: UserData) => Promise<string | null>
}

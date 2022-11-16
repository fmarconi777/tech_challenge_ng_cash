export type UserData = {
  username: string
  password: string
}

export interface AddUserAccount {
  add: (userData: UserData) => Promise<string | null>
}

export type BalanceModel = {
  balance: string
}

export interface LoadBalance {
  load: (id: number) => Promise<BalanceModel>
}

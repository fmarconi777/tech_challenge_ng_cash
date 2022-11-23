export class TransactionError extends Error {
  constructor (message: string) {
    super(`Transaction error: ${message}`)
    this.name = 'TransactionError'
  }
}

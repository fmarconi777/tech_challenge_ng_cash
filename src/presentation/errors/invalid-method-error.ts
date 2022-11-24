export class InvalidMethodError extends Error {
  constructor () {
    super('Invalid method')
    this.name = 'InvalidMethodError'
  }
}

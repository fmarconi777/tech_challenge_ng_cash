import { Controller, HttpRequest, HttpResponse, Validator, AddUserAccount } from './singup-protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, forbidden, okResponse, serverError } from '../helpers/http-helper'
import { UsernameInUseError } from '../errors/username-in-use-error'

export class SignUpController implements Controller {
  constructor (
    private readonly userValidator: Validator,
    private readonly passwordValidator: Validator,
    private readonly addUserAccount: AddUserAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username, password } = httpRequest.body
      if (!this.userValidator.isValid(username)) {
        return badRequest(new InvalidParamError('username'))
      }
      if (!this.passwordValidator.isValid(password)) {
        return badRequest(new InvalidParamError('password'))
      }
      const userAccount = await this.addUserAccount.add({
        username,
        password
      })
      if (!userAccount) {
        return forbidden(new UsernameInUseError())
      }
      return okResponse(userAccount)
    } catch (error: any) {
      return serverError()
    }
  }
}

import { Controller, HttpRequest, HttpResponse, Validator, AddUserAccount } from './singup-protocols'
import { InvalidParamError, MissingParamError, UsernameInUseError } from '../../errors'
import { badRequest, forbidden, methodNotAllowed, okResponse, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly userValidator: Validator,
    private readonly passwordValidator: Validator,
    private readonly addUserAccount: AddUserAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const method = httpRequest.method
    switch (method) {
      case 'POST':
        try {
          const requiredFields = ['username', 'password']
          for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
              return badRequest(new MissingParamError(field))
            }
          }
          const { username, password } = httpRequest.body
          if (!this.userValidator.isValid((username as string).trim())) {
            return badRequest(new InvalidParamError('username'))
          }
          if (!this.passwordValidator.isValid((password as string).trim())) {
            return badRequest(new InvalidParamError('password'))
          }
          const userAccount = await this.addUserAccount.addUserAccount({
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
      default:
        return methodNotAllowed()
    }
  }
}

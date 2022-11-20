import { Authentication } from '../../../domain/use-cases/authentication'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { username, password } = httpRequest.body
      await this.authentication.auth(username, password)
      return {
        status: 200,
        body: ''
      }
    } catch (error: any) {
      return serverError()
    }
  }
}

import { HttpResponse } from '../../protocols/http'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: Error): HttpResponse => {
  return {
    status: 400,
    body: error
  }
}

export const serverError = (): HttpResponse => {
  return {
    status: 500,
    body: new ServerError()
  }
}

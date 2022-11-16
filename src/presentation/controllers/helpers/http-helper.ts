import { HttpResponse } from '../../protocols/http'
import { ServerError } from '../errors/server-error'

export const okResponse = (data: any): HttpResponse => {
  return {
    status: 200,
    body: data
  }
}

export const badRequest = (error: Error): HttpResponse => {
  return {
    status: 400,
    body: error
  }
}

export const forbidden = (error: Error): HttpResponse => {
  return {
    status: 403,
    body: error
  }
}

export const serverError = (): HttpResponse => {
  return {
    status: 500,
    body: new ServerError()
  }
}

import { HttpResponse } from '../protocols/http'
import { UnauthorizedError, ServerError } from '../errors'

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

export const unauthorized = (): HttpResponse => {
  return {
    status: 401,
    body: new UnauthorizedError()
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

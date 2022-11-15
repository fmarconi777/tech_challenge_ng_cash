import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    status: 400,
    body: error
  }
}

export const serverError = (error: Error): HttpResponse => {
  return {
    status: 500,
    body: error
  }
}

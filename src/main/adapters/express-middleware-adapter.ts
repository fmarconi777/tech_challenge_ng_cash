import { Middleware, HttpRequest } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http-helper'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization: any = req.headers.authorization
    if (authorization) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const [, accessToken] = authorization?.split(' ')
      const httpRequest: HttpRequest = {
        header: accessToken
      }
      const httpResponse = await middleware.handle(httpRequest)
      if (httpResponse.status === 200) {
        Object.assign(req, httpResponse.body)
        next()
      } else {
        res.status(httpResponse.status).json({ error: (httpResponse.body as Error).message })
      }
    } else {
      const httpResponse = forbidden(new AccessDeniedError())
      return res.status(httpResponse.status).json({ error: (httpResponse.body as Error).message })
    }
  }
}

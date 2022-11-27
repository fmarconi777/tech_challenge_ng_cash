import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      param: req.params.param,
      method: req.method,
      user: req.user
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.status === 200) {
      res.status(httpResponse.status).json(httpResponse.body)
    } else {
      res.status(httpResponse.status).json({ error: (httpResponse.body as Error).message })
    }
  }
}

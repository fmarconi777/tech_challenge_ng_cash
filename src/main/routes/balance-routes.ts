import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeBalanceController } from '../factories/balance'
import { makeAuthMiddleware } from '../factories/middleware'

export default (router: Router): Router => {
  const auth = makeAuthMiddleware()
  router.get('/balance', adaptMiddleware(auth), adaptRoute(makeBalanceController())) // eslint-disable-line
  return router
}

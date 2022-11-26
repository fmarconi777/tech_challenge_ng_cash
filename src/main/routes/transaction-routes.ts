import { Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middleware'
import { makeTransactionController } from '../factories/transaction'

export default (router: Router): Router => {
  const auth = makeAuthMiddleware()
  router.post('/transaction', adaptMiddleware(auth), adaptRoute(makeTransactionController())) // eslint-disable-line
  router.get('/transaction', adaptMiddleware(auth), adaptRoute(makeTransactionController())) // eslint-disable-line
  return router
}
